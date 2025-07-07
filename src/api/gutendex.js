import React from "react";

// Get the correct download URL - prioritize HTML over TXT
function getDownloadUrl(formats) {
    if (!formats || typeof formats !== "object") return null;

    // Priority order: HTML with UTF-8, HTML, then TXT
    const priorities = [
        "text/html; charset=utf-8",
        "text/html",
        "text/plain; charset=utf-8",
        "text/plain",
    ];

    for (const mimeType of priorities) {
        if (formats[mimeType]) {
            return formats[mimeType];
        }
    }

    // Fallback: look for any HTML or TXT file in the URLs
    for (const [key, url] of Object.entries(formats)) {
        if (typeof url === "string") {
            if (
                url.toLowerCase().includes(".html") ||
                url.toLowerCase().includes(".htm")
            ) {
                return url;
            }
        }
    }

    for (const [key, url] of Object.entries(formats)) {
        if (typeof url === "string") {
            if (url.toLowerCase().includes(".txt")) {
                return url;
            }
        }
    }

    return null;
}

export async function fetchBooks(hint) {
    const baseUrl = "https://gutendex.com/books/";
    const randomPage = Math.floor(Math.random() * 1000) + 1;

    const url = hint
        ? `${baseUrl}?search=${encodeURIComponent(hint)}`
        : `${baseUrl}?page=${randomPage}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { results } = await response.json();

        // console.log(results);

        return results.map((book) => {
            const downloadUrl = getDownloadUrl(book.formats);

            return {
                id: book.id,
                title: book.title || null,
                author: book.authors?.[0]?.name || null,
                cover: book.formats?.["image/jpeg"] || null,
                publishDate: null,
                summary:
                    Array.isArray(book.summaries) && book.summaries.length > 0
                        ? book.summaries.join(" ")
                        : null,
                isbn: null,
                pages: null,
                genres:
                    Array.isArray(book.subjects) && book.subjects.length > 0
                        ? book.subjects.join(" ")
                        : null,
                downloadUrl,
            };
        });
    } catch (error) {
        console.error("Failed to fetch books:", error);
        return [];
    }
}

export async function fetchBooksFromPage(page = 1) {
    const url = `https://gutendex.com/books/?page=${page}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { results } = await response.json();
        // Map results as in your fetchBooks
        return results.map((book) => {
            const downloadUrl = getDownloadUrl(book.formats);
            return {
                id: book.id,
                title: book.title || null,
                author: book.authors?.[0]?.name || null,
                cover: book.formats?.["image/jpeg"] || null,
                publishDate: null,
                summary:
                    Array.isArray(book.summaries) && book.summaries.length > 0
                        ? book.summaries.join(" ")
                        : null,
                isbn: null,
                pages: null,
                genres:
                    Array.isArray(book.subjects) && book.subjects.length > 0
                        ? book.subjects.join(" ")
                        : null,
                downloadUrl,
            };
        });
    } catch (error) {
        console.error("Failed to fetch books:", error);
        return [];
    }
}
