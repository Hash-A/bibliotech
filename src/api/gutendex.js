import React from "react";

function getDownloadUrl(formats) {
  if (!formats || typeof formats !== 'object') return null;

  for (const url of Object.values(formats)) {
    if (typeof url === 'string' && url.toLowerCase().includes('.txt')) {
      return url;
    }
  }

  return null;
}

export async function fetchBooks(hint) {
    const baseUrl = 'https://gutendex.com/books/';
    const randomPage = Math.floor(Math.random() * 1000) + 1;
  
    const url = hint
      ? `${baseUrl}?search=${encodeURIComponent(hint)}`
      : `${baseUrl}?page=${randomPage}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { results } = await response.json();

      // console.log(results);
  
      return results.map(book => {
        const downloadUrl = getDownloadUrl(book.formats);
      
        return {
          id: book.id,
          title: book.title || null,
          author: book.authors?.[0]?.name || null,
          cover: book.formats?.['image/jpeg'] || null,
          publishDate: null,
          summary: Array.isArray(book.summaries) && book.summaries.length > 0
            ? book.summaries.join(' ')
            : null,
          isbn: null,
          pages: null,
          genres: Array.isArray(book.subjects) && book.subjects.length > 0
            ? book.subjects.join(' ')
            : null,
          downloadUrl,
        };
      });
      
      
    } catch (error) {
      console.error('Failed to fetch books:', error);
      return [];
    }
  }
  