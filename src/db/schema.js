export async function initDatabase(db) {
  // Create tables with new schema (only if they don't exist)
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT,
      author TEXT,
      cover TEXT,
      publishDate TEXT,
      summary TEXT,
      isbn TEXT,
      pages INTEGER,
      genres TEXT,
      inLibrary INTEGER DEFAULT 0,
      downloaded INTEGER DEFAULT 0,
      downloadPath TEXT,
      downloadUrl TEXT,
      isRecommendation INTEGER DEFAULT 0
    );
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      char_index INTEGER NOT NULL,
      UNIQUE(book_id, char_index)
    );
  `); 
}
  