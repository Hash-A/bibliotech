
// Helper function to get book by ID
export const getBookById = (books, id) => {
  return books.find(book => book.id === id);
};

// Helper function to search books
export const searchBooks = (books, query) => {
  return books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );
};