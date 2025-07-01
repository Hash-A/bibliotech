import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Card } from 'react-native-paper';
import MiniBookCard from '../bookCards/MiniBookCard';

export default function ContinueReadingSection({ books = [], onBookPress = () => {}, styles = {} }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentList}>
      {books.length === 0 ? (
        <Text style={{ margin: 18, color: '#888' }}>No books to continue reading.</Text>
      ) : (
        books.map((book) => (
          <MiniBookCard
            key={book.id}
            book={book}
            onPress={() => onBookPress(book)}
            style={styles.miniCard}
            coverStyle={styles.miniCover}
            titleStyle={styles.miniTitle}
          />
        ))
      )}
    </ScrollView>
  );
}
