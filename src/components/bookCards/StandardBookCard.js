import React from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { Card, Text } from "react-native-paper";
import { theme } from "../../styles/theme";

const COVER_ASPECT_RATIO = 1.5; // Standard book cover ratio (2:3 or 1.5)
const COVER_WIDTH = 85;
const COVER_HEIGHT = COVER_WIDTH * COVER_ASPECT_RATIO;

export default function StandardBookCard({ book, onPress }) {
    return (
        <Card
            key={book.id}
            style={styles.card}
            onPress={() => onPress(book.id)}
        >
            <View style={styles.overflowContainer}>
                <Card.Content style={styles.content}>
                    <View style={styles.coverContainer}>
                        {book.cover ? (
                            <Image
                                source={{ uri: book.cover, cache: 'force-cache' }}
                                style={styles.cover}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.cover, styles.placeholderCover]}>
                                <Text style={styles.placeholderText}>
                                    No Cover
                                </Text>
                            </View>
                        )}
                        {/* Add subtle shadow overlay */}
                        <View style={styles.coverOverlay} />
                    </View>
                    <View style={styles.bookInfo}>
                        <Text 
                            style={styles.title}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {book.title || "No Title"}
                        </Text>
                        <Text 
                            style={styles.author}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {book.author || "Unknown Author"}
                        </Text>
                    </View>
                </Card.Content>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    overflowContainer: {
        overflow: "hidden",
        borderRadius: theme.borderRadius.md,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        padding: theme.spacing.sm,
    },
    coverContainer: {
        position: 'relative',
        width: COVER_WIDTH,
        height: COVER_HEIGHT,
        borderRadius: theme.borderRadius.sm,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    cover: {
        width: COVER_WIDTH,
        height: COVER_HEIGHT,
        backgroundColor: theme.colors.surface,
    },
    placeholderCover: {
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        ...theme.typography.caption,
        color: theme.colors.text.disabled,
    },
    coverOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: theme.borderRadius.sm,
    },
    bookInfo: {
        flex: 1,
        marginLeft: theme.spacing.sm,
        justifyContent: "center",
    },
    title: {
        ...theme.typography.titleLarge,
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    author: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
    },
});
