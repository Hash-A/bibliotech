// Sample book data for the Bibliotech app
export const books = [
  {
    id: 1,
    title: 'The Republic',
    author: 'Plato',
    cover: 'https://picsum.photos/300/400?random=1',
    publishDate: '380 BCE',
    summary: 'A philosophical dialogue written by Plato around 380 BCE concerning the definition of justice and the order and character of the just city-state and the just man.',
    isbn: '978-0-14-044914-3',
    pages: 416,
    genres: ['Philosophy'],
    isPopular: false,
    isRecommendation: false,
    inMyLibrary: true,
    lastReadPage: 0,
  },
  {
    id: 2,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'https://picsum.photos/300/400?random=2',
    publishDate: 'January 28, 1813',
    summary: 'A romantic novel of manners that follows the emotional development of Elizabeth Bennet, who learns the error of making hasty judgments and comes to appreciate the difference between the superficial and the essential.',
    isbn: '978-0-14-143951-8',
    pages: 432,
    genres: ['Romance'],
    isPopular: false,
    isRecommendation: true,
    inMyLibrary: false,
    lastReadPage: 0,
  },
  {
    id: 3,
    title: 'Frankenstein',
    author: 'Mary Shelley',
    cover: 'https://picsum.photos/300/400?random=3',
    publishDate: 'January 1, 1818',
    summary: 'A novel that tells the story of Victor Frankenstein, a young scientist who creates a hideous, sapient creature in an unorthodox scientific experiment.',
    isbn: '978-0-14-143947-1',
    pages: 280,
    genres: ['Gothic Fiction'],
    isPopular: false,
    isRecommendation: false,
    inMyLibrary: true,
    lastReadPage: 25,
  },
  {
    id: 4,
    title: '1984',
    author: 'George Orwell',
    cover: 'https://picsum.photos/300/400?random=4',
    publishDate: 'June 8, 1949',
    summary: 'A dystopian social science fiction novel and cautionary tale that follows the life of Winston Smith, a low-ranking member of "the Party", who is frustrated by the omnipresent eyes of the party.',
    isbn: '978-0-452-28423-4',
    pages: 328,
    genres: ['Dystopian Fiction'],
    isPopular: true,
    isRecommendation: false,
    inMyLibrary: false,
    lastReadPage: 0,
  },
  {
    id: 5,
    title: 'Moby Dick',
    author: 'Herman Melville',
    cover: 'https://picsum.photos/300/400?random=5',
    publishDate: 'October 18, 1851',
    summary: 'An epic sea story of Captain Ahab\'s voyage in pursuit of Moby Dick, a great white whale. On one level, the novel is a sensitive portrait of life and its meaning.',
    isbn: '978-0-14-243724-7',
    pages: 720,
    genres: ['Adventure'],
    isPopular: true,
    isRecommendation: false,
    inMyLibrary: false,
    lastReadPage: 0,
  },
  {
    id: 6,
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    cover: 'https://picsum.photos/300/400?random=6',
    publishDate: '1605',
    summary: 'A Spanish novel that follows the adventures of Alonso Quixano, a retired country gentleman who becomes so enamored by the chivalrous ideals touted in books he has read that he decides to take up his lance and sword to defend the helpless and destroy the wicked.',
    isbn: '978-0-14-243723-0',
    pages: 863,
    genres: ['Satire'],
    isPopular: true,
    isRecommendation: true,
    inMyLibrary: false,
    lastReadPage: 0,
  },
  {
    id: 7,
    title: 'The Odyssey',
    author: 'Homer',
    cover: 'https://picsum.photos/300/400?random=7',
    publishDate: '8th century BCE',
    summary: 'One of two major ancient Greek epic poems attributed to Homer. The poem mainly focuses on the Greek hero Odysseus, known as Ulysses in Roman myths, and his journey home after the fall of Troy.',
    isbn: '978-0-14-026886-7',
    pages: 541,
    genres: ['Epic Poetry'],
    isPopular: false,
    isRecommendation: false,
    inMyLibrary: false,
    lastReadPage: 0,
  },
  {
    id: 8,
    title: 'Sample Book Title',
    author: 'Author Name',
    cover: 'https://picsum.photos/300/400?random=8',
    publishDate: 'January 15, 2023',
    summary: 'This is a compelling story that explores themes of love, loss, and redemption. The narrative follows the journey of our protagonist as they navigate through life\'s challenges and discover the true meaning of happiness.',
    isbn: '978-0-123456-78-9',
    pages: 320,
    genres: ['Fiction'],
    isPopular: false,
    isRecommendation: true,
    inMyLibrary: false,
    lastReadPage: 0,
  },
];

// Helper function to get book by ID
export const getBookById = (id) => {
  return books.find(book => book.id === id);
};

// Helper function to search books
export const searchBooks = (query) => {
  return books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );
};

/* const books = [
{
  id: "1",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  cover: "https://example.com/gatsby.jpg",
  genre: "Classic",
  isPopular: true,
  isRecommendation: false,
  inMyLibrary: true,
  lastReadPage: 45,
},
{
  id: "2",
  title: "To Kill a Mockingbird",
  author: "Harper Lee",
  cover: "https://example.com/mockingbird.jpg",
  genre: "Classic",
  isPopular: true,
  isRecommendation: true,
  inMyLibrary: false,
  lastReadPage: 0,
},
{
  id: "3",
  title: "Atomic Habits",
  author: "James Clear",
  cover: "https://example.com/atomic.jpg",
  genre: "Self-Help",
  isPopular: false,
  isRecommendation: true,
  inMyLibrary: true,
  lastReadPage: 120,
},
{
  id: "4",
  title: "The Hobbit",
  author: "J.R.R. Tolkien",
  cover: "https://example.com/hobbit.jpg",
  genre: "Fantasy",
  isPopular: true,
  isRecommendation: false,
  inMyLibrary: false,
  lastReadPage: 0,
},
// Add more books as needed
];

export default books;

Best Long-Term Data Structure for a Large Book Database
Recommended Approach:
Single "books" collection/table: Each book is a document/row with all its attributes.
User-specific data (like "My Library", "Continue Reading"): Store separately, referencing book IDs.
Flags/attributes: Use booleans or arrays for things like isPopular, isRecommendation, genres, etc.
Why?
Scalability: Easy to add new attributes or filter books by any flag.
Performance: Indexing on flags/fields is efficient in most databases.
User Data Separation: Keeps book data clean and user data private and scalable.*/