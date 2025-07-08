import React from 'react';
import { Card, Text } from 'react-native-paper';
import FastImage from 'expo-fast-image';

export default function MiniBookCard({ book, onPress, style, coverStyle, titleStyle }) {
  if (!book) return null;

  return (
    <Card
      style={style}
      onPress={onPress}
    >
      <FastImage
        source={{ uri: book.cover }}
        style={coverStyle}
        resizeMode="cover"
      />
      <Card.Content>
        <Text style={titleStyle}>{book.title}</Text>
      </Card.Content>
    </Card>
  );
}