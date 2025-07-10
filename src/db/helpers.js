import * as FileSystem from "expo-file-system";
import Fuse from "fuse.js";

export async function clearDatabase(db) {
    try {
        // console.log("trying to clear db");
        await db.runAsync("DELETE FROM books;");
        // console.log('Deleted books');
        await db.runAsync("DELETE FROM bookmarks;");
        // console.log('Deleted bookmarks');
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
          inLibrary, downloaded, downloadPath, downloadUrl
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    book.inLibrary ? 1 : 0,
                    book.downloaded ? 1 : 0,
                    book.downloadPath || null,
                    book.downloadUrl || null,
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
        // console.log(hint);
        if (typeof hint !== "string" || hint.trim() === "") {
            return allBooks.slice(0, 32);
        }

        const fuse = new Fuse(allBooks, {
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
        const book = await db.getFirstAsync(
            "SELECT * FROM books WHERE id = ?",
            id
        );
        if (book) {
            book.inLibrary = !!book.inLibrary;
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
        await db.runAsync(
            "UPDATE books SET inLibrary = ? WHERE id = ?",
            inLibrary ? 1 : 0,
            id
        );
    } catch (error) {
        console.error(`Error in setBookInLibrary (id: ${id}):`, error);
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
            if (fileInfo.exists) {
                return existingBook.downloadPath;
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
        await db.runAsync(
            "UPDATE books SET downloaded = 1, downloadPath = ? WHERE id = ?",
            downloadResult.uri,
            bookId
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
            await db.runAsync(
                "DELETE FROM bookmarks WHERE book_id = ? AND char_index = ?",
                bookId,
                charIndex
            );
        } else {
            await db.runAsync(
                "INSERT INTO bookmarks (book_id, char_index) VALUES (?, ?)",
                bookId,
                charIndex
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
    // This assumes your books are inserted in popularity order (from the API)
    return await db.getAllAsync(
        `SELECT * FROM books ORDER BY id ASC LIMIT ?`,
        limit
    );
}
