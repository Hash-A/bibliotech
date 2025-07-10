import React from 'react';
import { Card, Text } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';

export default function MiniBookCard({ book, onPress, style, coverStyle, titleStyle }) {
  if (!book) return null;

  return (
    <Card
      style={style}
      onPress={onPress}
    >
      <View style={styles.overflowContainer}>
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
          <Text numberOfLines={2} ellipsizeMode="tail" style={titleStyle}>
            {book.title}
          </Text>
        </Card.Content>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  overflowContainer: {
    overflow: 'hidden',
    borderRadius: 8,
  }
});