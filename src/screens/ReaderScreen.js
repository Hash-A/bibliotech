import React, {
    useState,
    useContext,
    useEffect,
    useRef,
    memo,
    useCallback,
} from "react";
import { BooksContext } from "../context/BooksContext";
import {
    View,
    StyleSheet,
    Animated,
    useWindowDimensions,
    Text as RNText,
} from "react-native";
import { Text } from "react-native-paper";
import RenderHtml from "react-native-render-html";
import { getBookById } from "../data/books";

// Enhanced text-to-HTML converter for plain text only
const convertTextToHtml = (text) => {
    if (!text) return "";

    return text
        .split(/\n\s*\n/) // Split on paragraph breaks
        .filter((para) => para.trim())
        .map((para) => `<p>${para.replace(/\n/g, " ")}</p>`)
        .join("");
};

// Extract and parse CSS from HTML documents
const extractCssFromHtml = (htmlContent) => {
    const cssRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let cssContent = "";
    let match;

    while ((match = cssRegex.exec(htmlContent)) !== null) {
        cssContent += match[1] + "\n";
    }

    return cssContent;
};

// Convert CSS rules to React Native styles
const parseCssToReactNative = (cssContent) => {
    const tagsStyles = {};
    const classesStyles = {};

    if (!cssContent) return { tagsStyles, classesStyles };

    // Basic CSS parsing - extract rules
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(cssContent)) !== null) {
        const selector = match[1].trim();
        const declarations = match[2].trim();

        // Parse declarations
        const styles = {};
        declarations.split(";").forEach((decl) => {
            const [property, value] = decl.split(":").map((s) => s.trim());
            if (property && value) {
                const rnProperty = convertCssPropertyToRN(property);
                const rnValue = convertCssValueToRN(property, value);
                if (rnProperty && rnValue !== null) {
                    styles[rnProperty] = rnValue;
                }
            }
        });

        // Apply to appropriate style object
        if (selector.startsWith(".")) {
            // Class selector
            const className = selector.substring(1);
            classesStyles[className] = styles;
        } else if (selector.match(/^[a-zA-Z]+$/)) {
            // Simple tag selector
            tagsStyles[selector] = styles;
        }
    }

    return { tagsStyles, classesStyles };
};

// Convert CSS properties to React Native equivalents
const convertCssPropertyToRN = (property) => {
    const propertyMap = {
        "font-size": "fontSize",
        "font-weight": "fontWeight",
        "font-style": "fontStyle",
        "font-family": "fontFamily",
        "text-align": "textAlign",
        color: "color",
        "background-color": "backgroundColor",
        margin: "margin",
        "margin-top": "marginTop",
        "margin-bottom": "marginBottom",
        "margin-left": "marginLeft",
        "margin-right": "marginRight",
        padding: "padding",
        "padding-top": "paddingTop",
        "padding-bottom": "paddingBottom",
        "padding-left": "paddingLeft",
        "padding-right": "paddingRight",
        "line-height": "lineHeight",
        "text-decoration": "textDecorationLine",
        "border-width": "borderWidth",
        "border-color": "borderColor",
        width: "width",
        height: "height",
    };

    return propertyMap[property] || null;
};

// Convert CSS values to React Native equivalents
const convertCssValueToRN = (property, value) => {
    if (!value) return null;

    // Handle numeric values
    if (
        property.includes("font-size") ||
        property.includes("margin") ||
        property.includes("padding")
    ) {
        if (value.includes("px")) {
            return parseInt(value.replace("px", ""));
        } else if (value.includes("em")) {
            return parseInt(parseFloat(value.replace("em", "")) * 16); // Approximate conversion
        } else if (value === "small") {
            return 12;
        } else if (value === "medium") {
            return 16;
        } else if (value === "large") {
            return 20;
        } else if (value === "smaller") {
            return 14;
        } else if (value === "larger") {
            return 18;
        }
    }

    // Handle text-align
    if (property === "text-align") {
        return ["left", "center", "right", "justify"].includes(value)
            ? value
            : null;
    }

    // Handle font-weight
    if (property === "font-weight") {
        if (value === "bold" || parseInt(value) >= 600) return "bold";
        if (value === "normal" || parseInt(value) < 600) return "normal";
    }

    // Handle colors
    if (property === "color" || property === "background-color") {
        if (value.startsWith("#") || value.startsWith("rgb")) {
            return value;
        }
        // Convert named colors to hex
        const colorMap = {
            black: "#000000",
            white: "#FFFFFF",
            red: "#FF0000",
            green: "#008000",
            blue: "#0000FF",
            gray: "#808080",
            grey: "#808080",
        };
        return colorMap[value.toLowerCase()] || value;
    }

    return value;
};

// Optimized HTML chunk renderer with dynamic CSS parsing
const LazyHtmlChunk = memo(
    ({ html, contentWidth, isVisible, onLayout, index, extractedStyles }) => {
        if (!isVisible) {
            return (
                <View style={styles.placeholderContainer} onLayout={onLayout}>
                    <RNText style={styles.placeholderText}>
                        Loading section {index + 1}...
                    </RNText>
                </View>
            );
        }

        const htmlSource = { html };

        // Use extracted styles or fall back to minimal defaults
        const defaultTagsStyles = {
            p: {
                marginBottom: 8,
                lineHeight: 20,
                fontSize: 16,
                color: "#333",
            },
            h1: {
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 12,
                marginTop: 16,
                color: "#222",
            },
            h2: {
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
                marginTop: 14,
                color: "#222",
            },
            h3: {
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 8,
                marginTop: 12,
                color: "#222",
            },
        };

        const tagsStyles = extractedStyles?.tagsStyles
            ? { ...defaultTagsStyles, ...extractedStyles.tagsStyles }
            : defaultTagsStyles;

        const classesStyles = extractedStyles?.classesStyles || {};

        return (
            <View style={styles.chunkContainer} onLayout={onLayout}>
                <RenderHtml
                    contentWidth={contentWidth}
                    source={htmlSource}
                    tagsStyles={tagsStyles}
                    classesStyles={classesStyles}
                    defaultTextProps={{
                        selectable: true,
                    }}
                    renderersProps={{
                        img: {
                            enableExperimentalPercentWidth: true,
                        },
                    }}
                    systemFonts={["System"]}
                    renderers={{
                        img: ({ TDefaultRenderer, ...props }) => (
                            <View style={styles.imageContainer}>
                                <TDefaultRenderer {...props} />
                            </View>
                        ),
                    }}
                />
            </View>
        );
    }
);

export default function ReaderScreen({ route }) {
    const { bookId } = route.params || {};
    const { allBooks, downloadBook, getDownloadedBookContent } =
        useContext(BooksContext);
    const { width } = useWindowDimensions();

    // State management
    const [content, setContent] = useState("");
    const [chunks, setChunks] = useState([]);
    const [visibleItems, setVisibleItems] = useState(new Set([0, 1, 2]));
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [titleHeight, setTitleHeight] = useState(0);
    const [processedChunks, setProcessedChunks] = useState(0);
    const [totalChunks, setTotalChunks] = useState(0);
    const [itemHeights, setItemHeights] = useState(new Map());
    const [extractedStyles, setExtractedStyles] = useState(null);

    const scrollY = useRef(new Animated.Value(0)).current;
    const processingTimeoutRef = useRef(null);

    const book = getBookById(allBooks, bookId);

    // Progressive chunking with smaller, more manageable sizes
    const progressiveChunkHtml = useCallback((html, chunkSize = 2000) => {
        if (!html || html === "loading...") return [];

        const chunks = [];
        let currentChunk = "";

        // More efficient paragraph splitting
        const paragraphs = html.split("</p>");

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph =
                paragraphs[i] + (i < paragraphs.length - 1 ? "</p>" : "");

            // If adding this paragraph would exceed chunk size and we have content
            if (
                currentChunk.length + paragraph.length > chunkSize &&
                currentChunk.trim()
            ) {
                chunks.push(currentChunk.trim());
                currentChunk = paragraph;
            } else {
                currentChunk += paragraph;
            }
        }

        // Add the last chunk if it has content
        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        return chunks.filter((chunk) => chunk.length > 0);
    }, []);

    // Batch processing function to prevent blocking
    const processBatches = useCallback(
        (htmlContent, batchSize = 10) => {
            return new Promise((resolve) => {
                const allChunks = progressiveChunkHtml(htmlContent);
                setTotalChunks(allChunks.length);

                let processedBatches = [];
                let currentIndex = 0;

                const processBatch = () => {
                    const batch = allChunks.slice(
                        currentIndex,
                        currentIndex + batchSize
                    );
                    processedBatches = [...processedBatches, ...batch];
                    currentIndex += batchSize;

                    setChunks(processedBatches);
                    setProcessedChunks(processedBatches.length);

                    if (currentIndex < allChunks.length) {
                        // Continue processing in next tick
                        processingTimeoutRef.current = setTimeout(
                            processBatch,
                            10
                        );
                    } else {
                        setIsProcessing(false);
                        resolve(processedBatches);
                    }
                };

                processBatch();
            });
        },
        [progressiveChunkHtml]
    );

    useEffect(() => {
        if (!book) return;

        const loadContent = async () => {
            try {
                setIsLoading(true);
                let rawContent;

                // Download logic
                if (book.downloaded !== 1) {
                    await downloadBook(bookId, book.downloadUrl);
                    rawContent = await getDownloadedBookContent(bookId);
                } else {
                    rawContent = await getDownloadedBookContent(bookId);
                }

                // Quick content type detection
                const isHtml =
                    rawContent.toLowerCase().includes("<html") ||
                    rawContent.toLowerCase().includes("<!doctype") ||
                    rawContent.toLowerCase().includes("<p>");

                let htmlContent;
                if (isHtml) {
                    // Extract CSS styles from the HTML
                    const cssContent = extractCssFromHtml(rawContent);
                    const styles = parseCssToReactNative(cssContent);
                    setExtractedStyles(styles);

                    // Clean up HTML by removing style and head tags
                    htmlContent = rawContent
                        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");
                } else {
                    htmlContent = convertTextToHtml(rawContent);
                }

                setContent(htmlContent);
                setIsLoading(false);
                setIsProcessing(true);

                // Start progressive processing
                await processBatches(htmlContent);
            } catch (error) {
                console.error("Error loading content:", error);
                setContent("Error loading content");
                setIsLoading(false);
                setIsProcessing(false);
            }
        };

        loadContent();

        // Cleanup timeout on unmount
        return () => {
            if (processingTimeoutRef.current) {
                clearTimeout(processingTimeoutRef.current);
            }
        };
    }, [bookId, book, processBatches]);

    // Handle item layout measurement for smooth scrolling
    const handleItemLayout = useCallback((index, event) => {
        const { height } = event.nativeEvent.layout;
        setItemHeights((prev) => {
            const newMap = new Map(prev);
            newMap.set(index, height);
            return newMap;
        });
    }, []);

    // Optimized viewability handling with larger buffer
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        const visible = new Set();

        viewableItems.forEach((item) => {
            const index = item.index;
            // Load current and more adjacent items for smoother scrolling
            for (let i = index - 2; i <= index + 2; i++) {
                if (i >= 0) visible.add(i);
            }
        });

        setVisibleItems(visible);
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 10,
        minimumViewTime: 100,
    }).current;

    const renderItem = useCallback(
        ({ item, index }) => (
            <LazyHtmlChunk
                html={item}
                contentWidth={width}
                isVisible={visibleItems.has(index)}
                onLayout={(event) => handleItemLayout(index, event)}
                index={index}
                extractedStyles={extractedStyles}
            />
        ),
        [width, visibleItems, handleItemLayout, extractedStyles]
    );

    // Remove getItemLayout to let FlatList handle dynamic heights
    const keyExtractor = useCallback((item, index) => `chunk-${index}`, []);

    // Early return after all hooks
    if (!book) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Book not found.</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading {book.title}...</Text>
            </View>
        );
    }

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.titleWrapper, { opacity: headerOpacity }]}
                onLayout={(event) => {
                    setTitleHeight(event.nativeEvent.layout.height);
                }}
            >
                <Text style={styles.title}>{book.title}</Text>
                {isProcessing && (
                    <Text style={styles.processingText}>
                        Processing: {processedChunks}/{totalChunks} sections
                    </Text>
                )}
            </Animated.View>

            <Animated.FlatList
                data={chunks}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingTop: titleHeight + (isProcessing ? 20 : 0),
                    paddingBottom: 50,
                }}
                initialNumToRender={5}
                maxToRenderPerBatch={3}
                windowSize={10}
                removeClippedSubviews={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={8}
                disableVirtualization={false}
                updateCellsBatchingPeriod={50}
                legacyImplementation={false}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 100,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    titleWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "#fff",
        zIndex: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        color: "#222",
    },
    processingText: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    placeholderContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8,
        minHeight: 100,
        paddingVertical: 20,
    },
    placeholderText: {
        color: "#999",
        fontSize: 12,
    },
    chunkContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 10,
    },
});
