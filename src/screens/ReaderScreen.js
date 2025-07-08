import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import { BooksContext } from "../context/BooksContext";
import { getBookById } from "../data/books";
import { chunkHtmlSafely } from "../utils/safeChunkHTML";

function fixImageSrc(html, bookId) {
    const basePath = `https://www.gutenberg.org/files/${bookId}/${bookId}-h`;

    return html.replace(/<img\s+[^>]*src=["'](?!https?:\/\/|data:|file:|\/)([^"']+)["']/gi, (match, relativeSrc) => {
        const absoluteUrl = `${basePath}/${relativeSrc.replace(/^\.\//, "")}`;
        return match.replace(relativeSrc, absoluteUrl);
    });
}


export default function ReaderScreen({ route }) {
    const { bookId } = route.params || {};
    const { allBooks, downloadBook, getDownloadedBookContent } = useContext(BooksContext);
    const { width } = useWindowDimensions();

    const [chunks, setChunks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const book = getBookById(allBooks, bookId);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                let content;
                if (book.downloaded !== 1) {
                    await downloadBook(bookId, book.downloadUrl);
                }
                content = await getDownloadedBookContent(bookId);
                const content_chunks = chunkHtmlSafely(fixImageSrc(content, bookId));
                setChunks(content_chunks);
            } catch (e) {
                setChunks(["<p>Error loading content</p>"]);
            }
            setIsLoading(false);
        };

        load();
    }, [bookId]);

    if (isLoading) {
        return <View><RenderHtml contentWidth={width} source={{ html: "<p>Loading...</p>" }} /></View>;
    }

    return (
        <FlatList
            data={chunks}
            keyExtractor={(_, idx) => `chunk-${idx}`}
            renderItem={({ item }) => (
                <View style={{ padding: 10 }}>
                    <RenderHtml contentWidth={width} source={{ html: item }} />
                </View>
            )}
        />
    );
}
