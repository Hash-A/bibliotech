import * as FileSystem from "expo-file-system";
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import Fuse from "fuse.js";

// Helper to run a single SQL write safely whether or not transactionAsync exists
async function safeExecute(db, sql, params = []) {
    if (typeof db.transactionAsync === 'function') {
        await db.transactionAsync(async (tx) => {
            await tx.executeSqlAsync(sql, ...params);
        });
    } else {
        await db.runAsync(sql, ...params);
    }
}

export async function clearDatabase(db) {
    try {
        // console.log("trying to clear db");
        await safeExecute(db, "DELETE FROM books;");
        await safeExecute(db, "DELETE FROM bookmarks;");
        // console.log('All data deleted from tables.');
    } catch (error) {
        console.log("Failed to clear database:", error);
    }
}

export async function insertBooks(db, books) {
    try {
        for (const book of books) {
            await db.runAsync(
                `INSERT OR IGNORE INTO books (
                    id, title, author, cover, publishDate, summary, isbn, pages, genres,
                    inLibrary, downloaded, downloadPath, downloadUrl, isRecommendation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    book.id,
                    book.title,
                    book.author,
                    book.cover,
                    book.publishDate,
                    book.summary,
                    book.isbn,
                    book.pages,
                    book.genres ? JSON.stringify(book.genres) : null,
                    book.inLibrary || 0,  // default 0
                    book.downloaded ? 1 : 0,
                    book.downloadPath || null,
                    book.downloadUrl || null,
                    book.isRecommendation ? 1 : 0,
                ]
            );
        }
    } catch (error) {
        console.error("Error in insertBooks:", error);
    }
}

// Get books with optional fuzzy search
export async function getBooks(db, hint) {
    try {
        const allBooks = await db.getAllAsync("SELECT * FROM books");
        // Convert isRecommendation to boolean for consistency
        const processedBooks = allBooks.map(book => ({
            ...book,
            isRecommendation: !!book.isRecommendation
        }));
        console.log('Books from DB:', processedBooks.length, 'Recommended:', processedBooks.filter(b => b.isRecommendation).length);
        
        if (typeof hint !== "string" || hint.trim() === "") {
            return processedBooks.slice(0, 32);
        }

        const fuse = new Fuse(processedBooks, {
            keys: ["title", "author"],
            threshold: 0.4,
            ignoreLocation: true,
        });

        return fuse
            .search(hint)
            .slice(0, 32)
            .map((r) => r.item);
    } catch (error) {
        console.error("Error in getBooks:", error);
        return [];
    }
}

// Get a specific book by ID
export async function getBook(db, id) {
    try {
        console.log('DB: Getting book by ID:', id);
        const book = await db.getFirstAsync(
            "SELECT * FROM books WHERE id = ?",
            id
        );
        console.log('DB: Book found:', {
            id,
            found: !!book,
            inLibrary: book?.inLibrary
        });
        if (book) {
            // Keep inLibrary as is to preserve timestamp
            book.downloaded = !!book.downloaded;
        }
        return book || null;
    } catch (error) {
        console.error(`Error in getBook (id: ${id}):`, error);
        return null;
    }
}

// Update inLibrary status
export async function setBookInLibrary(db, id, inLibrary) {
    try {
        console.log('DB: Attempting to set inLibrary status:', { id, inLibrary });
        await db.runAsync(
            "UPDATE books SET inLibrary = ? WHERE id = ?",
            inLibrary,  // Remove the boolean conversion to allow timestamp values
            id
        );
        
        // Verify the update
        const updatedBook = await getBook(db, id);
        console.log('DB: Book status after update:', {
            id,
            found: !!updatedBook,
            inLibrary: updatedBook?.inLibrary
        });
    } catch (error) {
        console.error(`Error in setBookInLibrary (id: ${id}):`, error);
        throw error;  // Re-throw to handle in UI
    }
}

// Download book and update DB
export async function downloadBook(db, bookId, url) {
    try {
        // First check if book already exists
        const existingBook = await db.getFirstAsync(
            "SELECT downloadPath FROM books WHERE id = ? AND downloaded = 1",
            bookId
        );
        
        if (existingBook?.downloadPath) {
            // Check if file actually exists
            const fileInfo = await FileSystem.getInfoAsync(existingBook.downloadPath);
            const MAX_SIZE = 10 * 1024 * 1024; // 10MB
            if (!fileInfo.exists || fileInfo.size === 0 || fileInfo.size > MAX_SIZE) {
                throw new Error('Downloaded file is empty or not accessible');
            }
        }

        // Create books directory if it doesn't exist
        const dir = `${FileSystem.documentDirectory}books/`;
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

        // Download the book
        const fileUri = `${dir}book_${bookId}.html`;
        const downloadResult = await FileSystem.downloadAsync(url, fileUri);

        if (downloadResult.status !== 200) {
            throw new Error(`Download failed with status ${downloadResult.status}`);
        }

        // Update the database
        await safeExecute(db,
            "UPDATE books SET downloaded = ? , downloadPath = ? WHERE id = ?",
            [1, downloadResult.uri, bookId]
        );

        return downloadResult.uri;
    } catch (error) {
        console.error(`Error in downloadBook (bookId: ${bookId}):`, error);
        throw error; // Re-throw to handle in UI
    }
}

const allowedExtensions = [".html", ".htm", ".txt", ".utf-8", ".utf8"];

export async function getDownloadedBookContent(db, id) {
    try {
        const book = await getBook(db, id);
        if (!book?.downloaded || !book.downloadPath) return null;

        // Check if downloadPath ends with one of the allowed extensions
        if (
            !allowedExtensions.some((ext) =>
                book.downloadPath.toLowerCase().endsWith(ext)
            )
        ) {
            console.warn(`Unsupported file extension: ${book.downloadPath}`);
            return null;
        }

        // Read content as UTF-8 (default)
        const content = await FileSystem.readAsStringAsync(book.downloadPath, {
            encoding: "utf8",
        });
        console.log("First 100 characters:", content.slice(0, 100));
        return content;
    } catch (error) {
        console.error(
            `Failed to read downloaded book content (id: ${id}):`,
            error
        );
        return null;
    }
}

// Toggle bookmark on/off
export async function toggleBookmark(db, bookId, charIndex) {
    try {
        const existing = await db.getFirstAsync(
            "SELECT * FROM bookmarks WHERE book_id = ? AND char_index = ?",
            bookId,
            charIndex
        );

        if (existing) {
            await safeExecute(db,
                "DELETE FROM bookmarks WHERE book_id = ? AND char_index = ?",
                [bookId, charIndex]
            );
        } else {
            await safeExecute(db,
                "INSERT INTO bookmarks (book_id, char_index) VALUES (?, ?)",
                [bookId, charIndex]
            );
        }
    } catch (error) {
        console.error(
            `Error in toggleBookmark (bookId: ${bookId}, charIndex: ${charIndex}):`,
            error
        );
    }
}

export async function getPopularBooks(db, limit = 96) {
    // Get top 96 most downloaded books (sorted by ID as they come from Gutendex)
    const topBooks = await db.getAllAsync(
        `SELECT * FROM books ORDER BY id ASC LIMIT ?`,
        limit
    );
    
    // Randomly select 32 books from the top 96
    const shuffled = [...topBooks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 32);
}

// Set a book as recommended
export async function setBookRecommendation(db, id, isRecommended) {
    try {
        console.log(`Setting book ${id} recommendation to ${isRecommended}`);
        await safeExecute(db,
            "UPDATE books SET isRecommendation = ? WHERE id = ?",
            [isRecommended ? 1 : 0, id]
        );
    } catch (error) {
        console.error(`Error in setBookRecommendation (id: ${id}):`, error);
    }
}
