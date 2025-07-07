import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Text } from "react-native";
export default function StandardBookCard({ book, onPress }) {
    return (
        <Card
            key={book.id}
            style={styles.resultCard}
            onPress={() => onPress(book.id)}
        >
            <View style={styles.overflowWrapper}>
                <Card.Content>
                    <View style={styles.bookContent}>
                        <Image
                            source={{ uri: book.cover }}
                            style={styles.bookCover}
                        />
                        <View style={styles.bookInfo}>
                            <Text style={styles.title}>
                                {book.title || "No Title"}
                            </Text>
                            <Text style={styles.author}>
                                {book.author || "Unknown Author"}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    resultCard: {
        marginBottom: 12,
        borderRadius: 8,
        // overflow: "hidden",
    },
    overflowWrapper: {
        // Add this if needed for overflow handling
    },
    bookContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    bookCover: {
        width: 60,
        height: 90,
        borderRadius: 4,
        marginRight: 16,
        backgroundColor: "#eee",
    },
    bookInfo: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    author: {
        fontSize: 14,
        color: "#666",
    },
});
