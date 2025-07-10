import React from 'react';
import { Card, Text } from 'react-native-paper';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { theme } from '../../styles/theme';

const MINI_COVER_WIDTH = 130;
const MINI_COVER_HEIGHT = MINI_COVER_WIDTH * 1.5; // Standard book cover ratio (2:3)

export default function MiniBookCard({ book, onPress, style }) {
  if (!book) return null;

  return (
    <Card
      style={[styles.card, style]}
      onPress={onPress}
    >
      <View style={styles.overflowContainer}>
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
          {/* Add subtle shadow overlay */}
          <View style={styles.coverOverlay} />
        </View>
        <Card.Content style={styles.content}>
          <Text 
            numberOfLines={2} 
            ellipsizeMode="tail" 
            style={styles.title}
          >
            {book.title}
          </Text>
          <Text 
            numberOfLines={1} 
            ellipsizeMode="tail" 
            style={styles.author}
          >
            {book.author || "Unknown Author"}
          </Text>
        </Card.Content>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: MINI_COVER_WIDTH + theme.spacing.md,
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
    overflow: 'hidden',
    borderRadius: theme.borderRadius.md,
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    height: MINI_COVER_HEIGHT,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cover: {
    width: '100%',
    height: '100%',
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
  },
  content: {
    padding: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.titleMedium,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  author: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  },
});