import React, { useState, useEffect, useContext, useRef } from "react";
import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";
import { BooksContext } from "../context/BooksContext";
import { getBookById } from "../data/books";

export default function ReaderScreen({ route }) {
    const { bookId } = route.params || {};
    const { allBooks, downloadBook, getDownloadedBookContent } = useContext(BooksContext);
    const { width } = useWindowDimensions();
    const webviewRef = useRef(null);

    const [htmlContent, setHtmlContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const book = getBookById(allBooks, bookId);

    useEffect(() => {
        const loadContent = async () => {
            if (!book) return;

            setIsLoading(true);
            try {
                let content;
                // Check if the book is downloaded
                if (book.downloaded !== 1) {
                    await downloadBook(bookId, book.downloadUrl);
                }
                // Fetch the downloaded content
                content = await getDownloadedBookContent(bookId);
                
                // If content exists, use it. Otherwise, fallback to the URL.
                if (content) {
                    setHtmlContent(content);
                } else if (book.downloadUrl) {
                    // This is a fallback in case offline content fails
                    // In a real scenario, you might want better error handling
                    setHtmlContent(null); // Indicates we should use the URI
                } else {
                    throw new Error("No content available for this book.");
                }

            } catch (e) {
                console.error("Error loading book content:", e);
                setHtmlContent(`<p>Error: Could not load book.</p>`);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [bookId, book]);

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
    
    if (isLoading || (!htmlContent && !book.downloadUrl)) {
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
            // Use the downloaded HTML content if available, otherwise use the URL
            source={htmlContent ? { html: htmlContent, baseUrl: 'https://www.gutenberg.org' } : { uri: book.downloadUrl }}
            style={{ flex: 1 }}
            injectedJavaScript={injectedJavaScript}
            onMessage={handleMessage}
            // Better loading experience
            startInLoadingState={true}
            renderLoading={() => (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' }}>
                    <ActivityIndicator size="large" />
                </View>
            )}
        />
    );
}
