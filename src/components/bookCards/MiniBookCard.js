import React from 'react';
import { Card, Text } from 'react-native-paper';
import { View, Image } from 'react-native';

export default function MiniBookCard({ book, onPress, style, coverStyle, titleStyle }) {
  if (!book) return null;

  return (
    <Card
      style={style}
      onPress={onPress}
    >
      {book.cover ? (
        <Image
          source={{ uri: book.cover }}
          style={coverStyle}
          resizeMode="cover"
        />
      ) : (
        <View style={[coverStyle, { backgroundColor: '#eee' }]} />
      )}
      <Card.Content>
        <Text style={titleStyle}>{book.title}</Text>
      </Card.Content>
    </Card>
  );
}