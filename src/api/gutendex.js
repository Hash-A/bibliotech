import React from "react";
import { Image } from "react-native";

// Get the correct download URL - prioritize HTML over TXT
function getDownloadUrl(formats) {
    if (!formats || typeof formats !== "object") return null;

    const normalizedFormats = {};
    for (const [key, value] of Object.entries(formats)) {
        if (typeof value === "string") {
            normalizedFormats[key.toLowerCase()] = value;
        }
    }

    // Preferred MIME types in priority order
    const preferredMimeTypes = [
        "text/html; charset=utf-8",
        "text/html",
        "text/plain; charset=utf-8",
        "text/plain",
    ];

    // First: try preferred formats
    for (const mime of preferredMimeTypes) {
        if (normalizedFormats[mime]) {
            return normalizedFormats[mime];
        }
    }

    // Fallback: look for any .html, .htm, or .txt file
    for (const url of Object.values(normalizedFormats)) {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes(".html") || lowerUrl.includes(".htm") || lowerUrl.includes(".txt")) {
            return url;
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

        const books = results.map((book) => {
            const downloadUrl = getDownloadUrl(book.formats);

            return {
                id: book.id,
                title: book.title || null,
                author: book.authors?.[0]?.name || null,
                cover: book.formats?.["image/jpeg"]
                    ? `https://images.weserv.nl/?url=${encodeURIComponent(book.formats["image/jpeg"].replace(/^https?:\/\//, ""))}&w=100&h=150`
                    : null,
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
                isRecommendation: false
            };
        });

        // Centralized preloading
        books
            .filter((book) => !!book.cover)
            .forEach((book) => Image.prefetch(book.cover));

        return books;
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
        const books = results.map((book) => {
            const downloadUrl = getDownloadUrl(book.formats);
            return {
                id: book.id,
                title: book.title || null,
                author: book.authors?.[0]?.name || null,
                cover: book.formats?.["image/jpeg"]
                    ? `https://images.weserv.nl/?url=${encodeURIComponent(book.formats["image/jpeg"].replace(/^https?:\/\//, ""))}&w=100&h=150`
                    : null,
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
                isRecommendation: false
            };
        });

        // Centralized preloading
        books
            .filter((book) => !!book.cover)
            .forEach((book) => Image.prefetch(book.cover));

        return books;
    } catch (error) {
        console.error("Failed to fetch books:", error);
        return [];
    }
}
