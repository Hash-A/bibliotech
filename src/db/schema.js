export async function initDatabase(db) {
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
      downloadPath TEXT
    );
  `);

  try {
    await db.runAsync(`ALTER TABLE books ADD COLUMN downloadUrl TEXT`);
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      console.error('Error adding downloadUrl column:', e);
    }
  }

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      char_index INTEGER NOT NULL,
      UNIQUE(book_id, char_index)
    );
  `); 
}
  