import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';

export default function BookHeader({ book }) {
  return (
    <View style={styles.header}>
      {book.cover ? (
        <Image
            source={{ uri: book.cover, cache: 'force-cache' }}
            style={styles.cover}
            resizeMode="cover"
        />
        ) : (
            <View style={[styles.cover, { backgroundColor: '#eee' }]} />
        )}
      <View style={styles.basicInfo}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        <Text style={styles.publishDate}>Published: {book.publishDate}</Text>
        {Array.isArray(book.genres) && book.genres.length > 0 && (
          <Text style={styles.genre}>{book.genres.join(', ')}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 30,
  },
  cover: {
    width: 180,
    height: 240,
    borderRadius: 8,
    marginRight: 16,
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  publishDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: '#888',
  },
});
