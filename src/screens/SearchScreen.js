import React, { useState, useContext, useEffect } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    ActivityIndicator,
} from "react-native";
import { Card } from "react-native-paper";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BooksContext } from "../context/BooksContext";
import SearchBar from "../components/search/SearchBar";
import StandardBookCard from "../components/bookCards/StandardBookCard";
import { theme } from "../styles/theme";

export default function SearchScreen() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popularBooks, setPopularBooks] = useState([]);
    const navigation = useNavigation();
    const { allBooks, getBooks, getPopularBooks } = useContext(BooksContext);

    // Load popular books on component mount
    useEffect(() => {
        const loadPopularBooks = async () => {
            const books = await getPopularBooks();
            setPopularBooks(books);
        };
        loadPopularBooks();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query.trim() === "") {
                setResults([]);
                return;
            }

            setLoading(true);
            getBooks(query)
                .then((books) => {
                    setResults(books);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Search failed:", err);
                    setLoading(false);
                });
        }, 300); // Increased debounce time slightly

        return () => clearTimeout(timeout);
    }, [query]);

    const handleBookPress = (book) => {
        navigation.navigate("BookPreview", { book });
    };

    const handleClearSearch = () => {
        setQuery("");
        setResults([]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBarContainer}>
                <SearchBar 
                    onChangeText={setQuery} 
                    value={query}
                    onClear={handleClearSearch}
                />
            </View>

            {query.trim() === "" ? (
                <ScrollView 
                    style={styles.popularSection}
                    contentContainerStyle={styles.contentContainer}
                >
                    <Text style={styles.popularTitle}>
                        Browse popular books
                    </Text>
                    {popularBooks.map((book) => (
                        <StandardBookCard
                            key={book.id}
                            book={book}
                            onPress={() => handleBookPress(book)}
                        />
                    ))}
                </ScrollView>
            ) : (
                <ScrollView 
                    style={styles.results}
                    contentContainerStyle={styles.contentContainer}
                >
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            style={styles.loader}
                            color={theme.colors.primary}
                        />
                    ) : results.length > 0 ? (
                        results.map((book) => (
                            <StandardBookCard
                                key={book.id}
                                book={book}
                                onPress={() => handleBookPress(book)}
                            />
                        ))
                    ) : (
                        <Text style={styles.noResults}>No results found.</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    searchBarContainer: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
        paddingTop: 70,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    contentContainer: {
        padding: theme.spacing.md,
    },
    popularSection: {
        flex: 1,
    },
    popularTitle: {
        ...theme.typography.title,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
    },
    results: {
        flex: 1,
    },
    loader: {
        marginTop: theme.spacing.xl,
    },
    noResults: {
        marginTop: theme.spacing.xl,
        textAlign: 'center',
        color: theme.colors.text.muted,
        ...theme.typography.body,
    },
});
