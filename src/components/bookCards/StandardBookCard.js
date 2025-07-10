import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Text } from "react-native";
import { theme } from "../../styles/theme";

export default function StandardBookCard({ book, onPress }) {
    return (
        <Card
            key={book.id}
            style={styles.resultCard}
            onPress={() => onPress(book.id)}
        >
            <View style={styles.overflowContainer}>
                <Card.Content>
                    <View style={styles.bookContent}>
                        {book.cover ? (
                            <Image
                                source={{ uri: book.cover }}
                                style={styles.bookCover}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.bookCover} />
                        )}
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
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    overflowContainer: {
        overflow: "hidden",
        borderRadius: theme.borderRadius.md,
    },
    bookContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    bookCover: {
        width: 60,
        height: 90,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    bookInfo: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        ...theme.typography.title,
        marginBottom: theme.spacing.xs,
    },
    author: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
});
