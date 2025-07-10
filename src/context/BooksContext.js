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
        // inLibrary === 0  not in library
        // inLibrary === 1  in library
        // inLibrary === 2 -> getTimeSeconds() viewed
        const getTimeSeconds = () => Math.floor(Date.now() / 1000);
        if (inLibrary === 2) inLibrary = getTimeSeconds();
        
        await helpers.setBookInLibrary(db.current, id, inLibrary);
        
        // Update allBooks state
        setAllBooks((prev) =>
            prev.map((book) => 
                book.id === id ? { ...book, inLibrary } : book
            )
        );
        
        // Also update searchResults if the book is in there
        setSearchResults((prev) =>
            prev.map((book) => 
                book.id === id ? { ...book, inLibrary } : book
            )
        );
    };

    // getBooks tries local DB first, then supplements from API if <32 results
    const getBooks = async (hint) => {
        const localBooks = await helpers.getBooks(db.current, hint);
        const needed = 32 - localBooks.length;

        if (needed <= 0) {
            setSearchResults(localBooks.slice(0, 32));
            return localBooks.slice(0, 32);
        }

        try {
            const apiBooks = await fetchFromApi(hint);
            
            // Get current library status for all API books
            const apiBookStatuses = await Promise.all(
                apiBooks.map(async (book) => ({
                    ...book,
                    inLibrary: await getLibraryStatus(book.id)
                }))
            );

            const existingIds = new Set(localBooks.map((b) => b.id));
            const newBooks = apiBookStatuses.filter((b) => !existingIds.has(b.id));

            // Insert new books into the database
            await helpers.insertBooks(db.current, newBooks);

            // Combine local and new books
            const combined = [...localBooks, ...newBooks].slice(0, 32);
            
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
            }}
        >
            {children}
        </BooksContext.Provider>
    );
}
