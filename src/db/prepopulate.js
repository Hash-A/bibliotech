import { fetchBooksFromPage } from '../api/gutendex';
import { insertBooks, setBookRecommendation } from './helpers';

// Add your recommended book IDs here
const RECOMMENDED_BOOK_IDS = [
  // Example Gutenberg IDs - replace these with your chosen books
  2554,  // Crime and Punishment
  52190,    // Ecce Homo: Complete Works, Volume Seventeen
  120,  // Treasure Island
  84,    // Frankenstein
  1952,  // The Yellow Wallpaper
  1727,    // The Odyssey
  1342,  // Pride and prejudice
  174    // The Picture of Dorian Gray
];

// New function to set recommendations
async function setRecommendedBooks(db) {
    console.log("Setting recommended books...");
    for (const id of RECOMMENDED_BOOK_IDS) {
        console.log(`Setting book ${id} as recommended`);
        await setBookRecommendation(db, id, true);
    }
    console.log("Finished setting recommendations");
}

export async function prepopulateDatabase(db) {
    console.log("Starting database prepopulation...");
    let allBooks = [];
    // Load first 2 pages of books for faster first-launch
    let initialBooks=[];
    for (let page=1; page<=2; page++){
        const pageBooks = await fetchBooksFromPage(page);
        initialBooks = initialBooks.concat(pageBooks);
    }
    await insertBooks(db, initialBooks);
    
    // Start from page 3 since 1-2 were loaded initially
    for (let page = 3; page <= 10; page++) {
        console.log(`Fetching page ${page}...`);
        const books = await fetchBooksFromPage(page);
        allBooks = allBooks.concat(books);
    }
    console.log(`Inserting ${allBooks.length} books...`);
    await insertBooks(db, allBooks);
    
    // Set recommendations after inserting books
    await setRecommendedBooks(db);
    
    // Verify recommendations were set
    const books = await db.getAllAsync("SELECT * FROM books WHERE isRecommendation = 1");
    console.log(`Verification: ${books.length} books are marked as recommended`);
}
