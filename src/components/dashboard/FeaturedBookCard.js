import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { theme } from '../../styles/theme';

export default function FeaturedBookCard({ book, onPress, style }) {
  if (!book) return null;

  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      <Card.Cover 
        source={{ uri: book.cover }} 
        style={styles.cover}
      />
      <Card.Content style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>By {book.author}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cover: {
    height: 200,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  content: {
    paddingVertical: theme.spacing.md,
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  author: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
});
