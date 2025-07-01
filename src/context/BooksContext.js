import React, { useState } from 'react';
import { books as initialBooks } from '../data/books';

// 1. Create the Context
export const BooksContext = React.createContext();

// 2. Create the Provider Component
export function BooksProvider({ children }) {
  const [books, setBooks] = useState(initialBooks);

  const setBookInLibrary = (id, inLibrary) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id ? { ...book, inMyLibrary: inLibrary } : book
      )
    );
  };

  return (
    <BooksContext.Provider value={{ books, setBookInLibrary }}>
      {children}
    </BooksContext.Provider>
  );
}
