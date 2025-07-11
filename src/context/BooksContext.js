import React, { createContext, useEffect, useRef, useState } from "react";
import * as SQLite from "expo-sqlite";
import { initDatabase } from "../db/schema";
import * as helpers from "../db/helpers";
import { fetchBooks as fetchFromApi } from "../api/gutendex";
import { prepopulateDatabase } from "../db/prepopulate";

export const BooksContext = createContext();

export function BooksProvider({ children }) {
    const [searchResults, setSearchResults] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const db = useRef(null);

    const getLibraryStatus = async (bookId) => {
        try {
            const book = await helpers.getBook(db.current, bookId);
            console.log('getLibraryStatus:', { bookId, status: book?.inLibrary || 0 });
            return book ? book.inLibrary : 0;
        } catch (error) {
            console.error('Error getting library status:', error);
            return 0;
        }
    };

    const fetchBooks = async (hint) => {
        const results = await fetchFromApi(hint);
        
        // Get library status for each book
        const booksWithStatus = await Promise.all(
            results.map(async (book) => ({
                ...book,
                inLibrary: await getLibraryStatus(book.id)
            }))
        );
        
        setSearchResults(booksWithStatus);
        return booksWithStatus;
    };

    const setBookInLibrary = async (id, inLibrary) => { 
        console.log('setBookInLibrary called:', { id, inLibrary });
        
        // inLibrary === 0  not in library
        // inLibrary === 1  in library
        // inLibrary === 2 -> getTimeSeconds() viewed
        const getTimeSeconds = () => Math.floor(Date.now() / 1000);
        if (inLibrary === 2) inLibrary = getTimeSeconds();
        
        try {
            await helpers.setBookInLibrary(db.current, id, inLibrary);
            console.log('Database update completed');
            
            // If the book isn't in allBooks but is in searchResults, add it to allBooks
            const bookInAll = allBooks.some(b => b.id === id);
            const searchBook = searchResults.find(b => b.id === id);
            
            if (!bookInAll && searchBook) {
                console.log('Adding search result book to allBooks');
                setAllBooks(prev => [...prev, { ...searchBook, inLibrary }]);
            } else if (!bookInAll && !searchBook) {
                // Book not present in either array; fetch fresh row from DB and add it
                try {
                    const freshBook = await helpers.getBook(db.current, id);
                    if (freshBook) {
                        console.log('Fetched fresh book to add into state arrays');
                        setAllBooks(prev => [...prev, freshBook]);
                        setSearchResults(prev => [...prev, freshBook]);
                    }
                } catch(fetchErr) {
                    console.warn('Unable to fetch fresh book after library update', fetchErr);
                }
            } else {
                // Update allBooks state
                setAllBooks((prev) => {
                    const newBooks = prev.map((book) => 
                        book.id === id ? { ...book, inLibrary } : book
                    );
                    console.log('allBooks updated:', {
                        bookFound: prev.some(b => b.id === id),
                        oldStatus: prev.find(b => b.id === id)?.inLibrary,
                        newStatus: inLibrary
                    });
                    return newBooks;
                });
            }
            
            // Also update searchResults if the book is in there
            setSearchResults((prev) => {
                const newResults = prev.map((book) => 
                    book.id === id ? { ...book, inLibrary } : book
                );
                console.log('searchResults updated:', {
                    bookFound: prev.some(b => b.id === id),
                    oldStatus: prev.find(b => b.id === id)?.inLibrary,
                    newStatus: inLibrary
                });
                return newResults;
            });
        } catch (error) {
            console.error('Error in setBookInLibrary:', error);
            throw error;
        }
    };

    // getBooks tries local DB first, then supplements from API if <32 results
    const getBooks = async (hint) => {
        console.log('getBooks called with hint:', hint);
        const localBooks = await helpers.getBooks(db.current, hint);
        console.log('Local books found:', localBooks.length);
        
        const needed = 32 - localBooks.length;

        if (needed <= 0) {
            setSearchResults(localBooks.slice(0, 32));
            return localBooks.slice(0, 32);
        }

        try {
            const apiBooks = await fetchFromApi(hint);
            console.log('API books fetched:', apiBooks.length);
            
            // Get current library status for all API books
            const apiBookStatuses = await Promise.all(
                apiBooks.map(async (book) => {
                    const status = await getLibraryStatus(book.id);
                    return { ...book, inLibrary: status };
                })
            );
            console.log('API books with status:', apiBookStatuses.map(b => ({ id: b.id, inLibrary: b.inLibrary })));

            const existingIds = new Set(localBooks.map((b) => b.id));
            const newBooks = apiBookStatuses.filter((b) => !existingIds.has(b.id));

            // Insert new books into the database
            await helpers.insertBooks(db.current, newBooks);
            console.log('New books inserted into database:', newBooks.length);

            // Combine local and new books
            const combined = [...localBooks, ...newBooks].slice(0, 32);
            console.log('Combined results:', combined.length);
            
            setSearchResults(combined);
            return combined;
        } catch (e) {
            console.error("getBooks API fallback failed:", e);
            setSearchResults(localBooks);
            return localBooks;
        }
    };

    const getBook = async (id) => {
        return await helpers.getBook(db.current, id);
    };

    const downloadBook = async (id, url) => {
        try {
            // Check both allBooks and searchResults for the book
            const book = allBooks.find(b => b.id === id) || 
                        searchResults.find(b => b.id === id);
                        
            if (!book || book.downloaded) {
                return book?.downloadPath;
            }

            const result = await helpers.downloadBook(db.current, id, url);
            
            // Update both states with downloaded status
            const updateBookState = (prevBooks) =>
                prevBooks.map((book) =>
                    book.id === id
                        ? { ...book, downloaded: true, downloadPath: result }
                        : book
                );
                
            setSearchResults(updateBookState);
            setAllBooks(updateBookState);
            
            return result;
        } catch (error) {
            console.error(`Error downloading book (id: ${id}):`, error);
            throw error;
        }
    };

    const getDownloadedBookContent = async (id) => {
        const content = await helpers.getDownloadedBookContent(db.current, id);
        return content;
    };

    const toggleBookmark = async (bookId, charIndex) => {
        await helpers.toggleBookmark(db.current, bookId, charIndex);
    };

    const getPopularBooks = async () => {
        return await helpers.getPopularBooks(db.current);
    };

    useEffect(() => {
        const setup = async () => {
            try {
                const newdb = await SQLite.openDatabaseAsync("books.db");
                db.current = newdb;

                // Initialize database schema (but don't clear data)
                await initDatabase(db.current);
                console.log("Database initialized");

                // Check if database is empty
                const existingBooks = await helpers.getBooks(db.current, null);
                if (existingBooks.length === 0) {
                    // Only prepopulate if empty
                    console.log("Database empty, prepopulating...");
                    await prepopulateDatabase(db.current);
                    console.log("Database prepopulated");
                }

                // Load books including recommendations
                const fetchedBooks = await helpers.getBooks(db.current, null);
                setAllBooks(fetchedBooks);
                setSearchResults([]);  // Clear any initial search results

            } catch (e) {
                console.error("Setup failed:", e);
            }
        };

        setup();
    }, []);

    return (
        <BooksContext.Provider
            value={{
                books: searchResults,  // Keep the name 'books' for backward compatibility
                allBooks,
                fetchBooks,
                setBookInLibrary,
                getBooks,
                getBook,
                downloadBook,
                getDownloadedBookContent,
                toggleBookmark,
                getPopularBooks,
            }}
        >
            {children}
        </BooksContext.Provider>
    );
}
