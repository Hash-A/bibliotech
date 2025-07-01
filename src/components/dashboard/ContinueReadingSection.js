import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Card } from 'react-native-paper';

export default function ContinueReadingSection({ books = [], onBookPress = () => {}, styles = {} }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentList}>
      {books.length === 0 ? (
        <Text style={{ margin: 16, color: '#888' }}>No books to continue reading.</Text>
      ) : (
        books.map((book) => (
          <Card
            key={book.id}
            style={styles.miniCard}
            onPress={() => onBookPress(book)}
          >
            <Card.Cover source={{ uri: book.cover }} style={styles.miniCover} />
            <Card.Content>
              <Text style={styles.miniTitle}>{book.title}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}
