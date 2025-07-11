import React, { useState, useEffect, useContext, useRef } from "react";
import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";
import { BooksContext } from "../context/BooksContext";
import { getBookById } from "../data/books";

export default function ReaderScreen({ route }) {
    const { book } = route.params || {};
    const { allBooks, downloadBook, getDownloadedBookContent } = useContext(BooksContext);
    const { width } = useWindowDimensions();
    const webviewRef = useRef(null);

    const bookId = book ? book.id : null;

    const [htmlContent, setHtmlContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // const book = getBookById(allBooks, bookId);

    // Attempt to load local cached content; otherwise download and cache, or fallback to remote URL.
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!book) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // 1. Try to read already-downloaded content
                let content = await getDownloadedBookContent(bookId);

                // 2. If not downloaded yet but user owns the book (or chooses), download it now
                if (!content && book.downloadUrl) {
                    await downloadBook(bookId, book.downloadUrl);
                    content = await getDownloadedBookContent(bookId);
                }

                if (!cancelled) {
                    if (content) {
                        setHtmlContent(content);
                    } else {
                        // Fallback: show remote URL via WebView (requires connectivity)
                        setHtmlContent("");
                    }
                }
            } catch (err) {
                console.error("Reader load error", err);
                if (!cancelled) setHtmlContent(`<p>Error: Could not load book.</p>`);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [bookId]);

    // This JS code is injected into the WebView
    const injectedJavaScript = `
      window.addEventListener('scroll', function() {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercent = (scrollPosition / totalHeight) * 100;
        
        if (!isNaN(scrollPercent)) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SCROLL', progress: scrollPercent }));
        }
      });
      true; // Must be the last line
    `;

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'SCROLL') {
                // For now, we just log it. You can save this progress to state or a database.
                console.log('Scroll Progress:', data.progress.toFixed(2) + '%');
            }
        } catch (error) {
            // It's possible to receive messages that are not JSON
            // console.warn('Received non-JSON message from WebView:', event.nativeEvent.data);
        }
    };
    
    if (isLoading || (!htmlContent && !book?.downloadUrl)) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <WebView
            ref={webviewRef}
            originWhitelist={["*"]}
            source={htmlContent ? { html: htmlContent, baseUrl: 'https://www.gutenberg.org' } : { uri: book?.downloadUrl }}
            style={{ flex: 1 }}
            mixedContentMode="always"
            injectedJavaScript={injectedJavaScript}
            onMessage={handleMessage}
            startInLoadingState={true}
            renderLoading={() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator size="large" />
                </View>
            )}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error:', nativeEvent);
                setHtmlContent(`<p>Error: Could not load book.</p>`);
            }}
        />
    );
}
