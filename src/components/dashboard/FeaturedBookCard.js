import React from 'react';
import { Card, Text } from 'react-native-paper';

export default function FeaturedBookCard({ book, onPress, style }) {
  if (!book) return null;

  return (
    <Card style={style} onPress={onPress}>
      <Card.Cover source={{ uri: book.cover }} />
      <Card.Content>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{book.title}</Text>
        <Text>By {book.author}</Text>
      </Card.Content>
    </Card>
  );
}
