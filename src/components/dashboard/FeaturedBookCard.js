import React from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { theme } from '../../styles/theme';

const COVER_WIDTH = 140;
const COVER_HEIGHT = COVER_WIDTH * 1.5; // Standard book cover ratio (2:3)

export default function FeaturedBookCard({ book, onPress, style }) {
  if (!book) return null;

  return (
    <Card 
      style={[styles.card, style]} 
      onPress={onPress}
    >
      <View style={styles.overflowContainer}>
        <Card.Content style={styles.content}>
          <View style={styles.bookContent}>
            {/* Cover */}
            <View style={styles.coverContainer}>
              {book.cover ? (
                <Image
                  source={{ uri: book.cover }}
                  style={styles.cover}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.cover, styles.placeholderCover]}>
                  <Text style={styles.placeholderText}>No Cover</Text>
                </View>
              )}
            </View>

            {/* Book Info */}
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
              {book.summary && (
                <Text 
                  style={styles.summary}
                  numberOfLines={8}
                  ellipsizeMode="tail"
                >
                  {book.summary}
                </Text>
              )}
            </View>
          </View>
        </Card.Content>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
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
    padding: theme.spacing.sm,
  },
  bookContent: {
    flexDirection: "row",
    minHeight: COVER_HEIGHT, // Ensure content matches cover height
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
  bookInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'flex-start', // Start content from top
  },
  title: {
    ...theme.typography.titleLarge,
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  author: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  summary: {
    ...theme.typography.bodySmall, // Smaller font size
    color: theme.colors.text.secondary,
    opacity: 0.8,
    lineHeight: 18, // Adjusted line height for better readability
  },
});
