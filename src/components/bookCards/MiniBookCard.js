import React from 'react';
import { Card, Text } from 'react-native-paper';

export default function MiniBookCard({ book, onPress, style, coverStyle, titleStyle }) {
  if (!book) return null;

  return (
    <Card
      style={style}
      onPress={onPress}
    >
      <Card.Cover source={{ uri: book.cover }} style={coverStyle} />
      <Card.Content>
        <Text style={titleStyle}>{book.title}</Text>
      </Card.Content>
    </Card>
  );
}