import { fetchBooksFromPage } from '../api/gutendex'; // see below
import { insertBooks } from './helpers';

export async function prepopulateDatabase(db) {
  let allBooks = [];
  for (let page = 1; page <= 10; page++) {
    const books = await fetchBooksFromPage(page);
    allBooks = allBooks.concat(books);
  }
  await insertBooks(db, allBooks);
}
