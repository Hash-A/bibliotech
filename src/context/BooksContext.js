import React, { createContext, useEffect, useRef, useState } from "react";
import * as SQLite from "expo-sqlite";
import { initDatabase } from "../db/schema";
import * as helpers from "../db/helpers";
import { fetchBooks as fetchFromApi } from "../api/gutendex";
import { prepopulateDatabase } from "../db/prepopulate";

export const BooksContext = createContext();

export function BooksProvider({ children }) {
    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const db = useRef(null);

    const fetchBooks = async (hint) => {
        const results = await fetchFromApi(hint);
        setBooks(results);
        return results;
    };

    const setBookInLibrary = async (id, inLibrary) => { 
        // inLibrary === 0  not in library
        // inLibrary === 1  in library
        // inLibrary === 2 -> getTimeSeconds() viewed
        const getTimeSeconds = () => Math.floor(Date.now() / 1000);
        if (inLibrary === 2) inLibrary = getTimeSeconds();
        
        await helpers.setBookInLibrary(db.current, id, inLibrary);
        setBooks((prev) =>
            prev.map((book) => (book.id === id ? 
                ((bk,inLib)=>{
                    bk.inLibrary=inLib; 
                    return bk;})(book, inLibrary) 
                : book))
        );
        setAllBooks((prev) =>
            prev.map((book) => (book.id === id ? 
                ((bk,inLib)=>{
                    bk.inLibrary=inLib; 
                    return bk;})(book, inLibrary) 
                : book))
        );
    };

    // getBooks tries local DB first, then supplements from API if <32 results
    const getBooks = async (hint) => {
        // console.log("in getBooks");
        const localBooks = await helpers.getBooks(db.current, hint);
        // console.log("searched database: ", localBooks);

        const needed = 32 - localBooks.length;
        // console.log("needed: ", needed);
        if (needed <= 0) {
            return localBooks.slice(0, 32);
        }

        try {
            // console.log("fetching from api with hint: ", hint);
            const apiBooks = await fetchFromApi(hint);
            // console.log(apiBooks);
            const existingIds = new Set(localBooks.map((b) => b.id));
            const newBooks = apiBooks.filter((b) => !existingIds.has(b.id));

            await helpers.insertBooks(db.current, newBooks);
            const combined = [...localBooks, ...newBooks].slice(0, 32);
            setAllBooks(combined);
            setBooks(combined);
            return combined;
        } catch (e) {
            console.error("getBooks API fallback failed:", e);
            return localBooks;
        }
    };

    const getBook = async (id) => {
        return await helpers.getBook(db.current, id);
    };

    const downloadBook = async (id, url) => {
        try {
            const book = allBooks.find(b => b.id === id);
            if (!book || book.downloaded) {
                return book?.downloadPath; // Return existing path if already downloaded
            }

            const result = await helpers.downloadBook(db.current, id, url);
            
            // Update both books and allBooks state with downloaded status
            const updateBooks = (prevBooks) =>
                prevBooks.map((book) =>
                    book.id === id
                        ? { ...book, downloaded: true, downloadPath: result }
                        : book
                );
                
            setBooks(updateBooks);
            setAllBooks(updateBooks);
            
            return result;
        } catch (error) {
            console.error(`Error downloading book (id: ${id}):`, error);
            throw error; // Re-throw to handle in UI
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

                await initDatabase(db.current);

                // 1. Check if database is empty
                const existingBooks = await helpers.getBooks(db.current, null);
                if (existingBooks.length === 0) {
                    // 2. Prepopulate if empty
                    await prepopulateDatabase(db.current);
                }

                // 3. Now run your normal fetch logic
                const fetchedBooks = await helpers.getBooks(db.current, null);

                if (fetchedBooks.length === 0) {
                    const newBooks = await fetchBooks(null);
                    await helpers.insertBooks(db.current, newBooks);
                    setAllBooks(newBooks);
                } else {
                    setAllBooks(fetchedBooks);
                }
            } catch (e) {
                console.error("Setup failed:", e);
            }
        };

        setup();
    }, []);

    return (
        <BooksContext.Provider
            value={{
                books,
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
