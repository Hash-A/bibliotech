// import React, { useState } from 'react';
// import { books as initialBooks } from '../data/books';

// // 1. Create the Context
// export const BooksContext = React.createContext();

// // 2. Create the Provider Component

// async function fetchBooks(hint) {
//   const baseUrl = 'https://gutendex.com/books/';
//   const randomPage = Math.floor(Math.random() * 1000) + 1;

//   const url = hint
//     ? `${baseUrl}?search=${encodeURIComponent(hint)}`
//     : `${baseUrl}?page=${randomPage}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`HTTP ${response.status}`);
//     const data = await response.json();

//     return data.results.map(book => ({
//       id: book.id,
//       title: book.title || null,
//       author: (book.authors && book.authors[0] && book.authors[0].name) || null,
//       cover: book.formats && book.formats['image/jpeg'] ? book.formats['image/jpeg'] : null,
//       publishDate: null, // Not provided by Gutendex
//       summary: null,     // Not provided by Gutendex
//       isbn: null,        // Not provided by Gutendex
//       pages: null,       // Not provided by Gutendex
//       genres: book.subjects && book.subjects.length > 0 ? book.subjects : null,
//     }));
//   } catch (error) {
//     console.error('Failed to fetch books:', error);
//     return [];
//   }
// }

// function initDatabase(db) {
//   db.transaction(tx => {
//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS books (
//         id INTEGER PRIMARY KEY NOT NULL,
//         title TEXT,
//         author TEXT,
//         cover TEXT,
//         publishDate TEXT,
//         summary TEXT,
//         isbn TEXT,
//         pages INTEGER,
//         genres TEXT,
//         inLibrary INTEGER DEFAULT 0,
//         downloaded INTEGER DEFAULT 0,
//         downloadPath TEXT
//       );
//     `);

//     tx.executeSql(`
//       CREATE TABLE IF NOT EXISTS bookmarks (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         book_id INTEGER NOT NULL,
//         char_index INTEGER NOT NULL,
//         UNIQUE(book_id, char_index)
//       );
//     `);
//   });
// }


// /*

// None Export (internal) methods: 
//   - fetchBooks(hint: string | null) => Book[]

// Book Context Methods:
//   - setBookInLibrary(book_id: number, inLibrary: boolean) // informs the database that the book is (or isnt) in the library
//   - getBooks(hint: string | null) => Book[] // fetches a list of min(n, 32) books, if `hint` is provided its used as search criterion 
//   - downloadBook(book_id: number) // downloads book 
//   - getBook(book_id: number) => Book // fetches downloaded book 
//   - toggleBookmark(book_id: number, char_index: number) // toggles a bookmark at the specified index in the specified book
// */
// export function BooksProvider({ children }) {
//   const [books, setBooks] = useState(initialBooks);

  

//   const setBookInLibrary = (id, inLibrary) => {
//     setBooks(prevBooks =>
//       prevBooks.map(book =>
//         book.id === id ? { ...book, inMyLibrary: inLibrary } : book
//       )
//     );
//   };

//   return (
//     <BooksContext.Provider value={{ books, setBookInLibrary }}>
//       {children}
//     </BooksContext.Provider>
//   );
// }




import React, { createContext, useEffect, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { initDatabase } from '../db/schema';
import * as helpers from '../db/helpers';
import { fetchBooks as fetchFromApi } from '../api/gutendex';
import { prepopulateDatabase } from '../db/prepopulate';

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
    await helpers.setBookInLibrary(db.current, id, inLibrary);
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, inLibrary } : book
      )
    );
    setAllBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, inLibrary } : book
      )
    );
  };

  // getBooks tries local DB first, then supplements from API if <32 results
  const getBooks = async (hint) => {
    console.log("in getBooks");
    const localBooks = await helpers.getBooks(db.current, hint);
    // console.log("searched database: ", localBooks);

    const needed = 32 - localBooks.length;
    // console.log("needed: ", needed);
    if (needed <= 0) {
      return localBooks.slice(0, 32);
    }

    try {
      console.log("fetching from api with hint: ", hint);
      const apiBooks =  await fetchFromApi(hint);
      // console.log(apiBooks);
      const existingIds = new Set(localBooks.map(b => b.id));
      const newBooks = apiBooks.filter(b => !existingIds.has(b.id));

      await helpers.insertBooks(db.current, newBooks);
      const combined = [...localBooks, ...newBooks].slice(0, 32);
      setAllBooks(combined);
      setBooks(combined);
      return combined;
    } catch (e) {
      console.error('getBooks API fallback failed:', e);
      return localBooks;
    }
  };

  const getBook = async (id) => {
    return await helpers.getBook(db.current, id);
  };

  const downloadBook = async (id, url) => {
    const uri = await helpers.downloadBook(db.current, id, url);
    setBooks(prev =>
      prev.map(book =>
        book.id === id ? { ...book, downloaded: true, downloadPath: uri } : book
      )
    );
    return uri;
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
        const newdb = await SQLite.openDatabaseAsync('books.db');
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
