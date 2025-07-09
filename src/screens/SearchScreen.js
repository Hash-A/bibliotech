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
import * as helpers from "../db/helpers"; // if not already imported

export default function SearchScreen() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { allBooks, getBooks, db } = useContext(BooksContext);

    // console.log('allBooks:', allBooks);
    const popularBooks = allBooks.slice(0, 96);

    // Debounce: delay search until typing stops
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
        }, 100); // debounce delay

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        const fetchPopular = async () => {
            if (db?.current) {
                const books = await helpers.getPopularBooks(db.current, 92);
                setPopularBooks(books);
            }
        };
        fetchPopular();
    }, [db]);

    const handlePopularPress = (title) => {
        setQuery(title);
    };

    const handleBookPress = (bookId) => {
        navigation.navigate("BookPreview", { bookId });
    };

    return (
        <View style={styles.container}>
            <SearchBar onChangeText={setQuery} value={query} />

            {query.trim() === "" ? (
                <ScrollView style={styles.popularSection}>
                    <Text style={styles.popularTitle}>
                        Browse popular books
                    </Text>
                    {popularBooks.map((book) => (
                        <StandardBookCard
                            key={book.id}
                            book={book}
                            onPress={() => handleBookPress(book.id)}
                        />
                    ))}
                </ScrollView>
            ) : (
                <ScrollView style={styles.results}>
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            style={{ marginTop: 20 }}
                        />
                    ) : results.length > 0 ? (
                        results.map((book) => (
                            <StandardBookCard
                                key={book.id}
                                book={book}
                                onPress={handleBookPress}
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
        padding: 16,
        backgroundColor: "#fff",
        flex: 1,
    },
    popularSection: {
        marginTop: 10,
    },
    popularTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "600",
    },
    results: {
        marginTop: 10,
    },
    noResults: {
        marginTop: 20,
        textAlign: "center",
        color: "#999",
    },
});
