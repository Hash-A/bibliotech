import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { books } from '../data/books';

export default function MyLibraryScreen() {
  const navigation = useNavigation();

  // Only show books that are in the user's library
  const myLibraryBooks = books.filter(book => book.inMyLibrary);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Library</Text>
      {myLibraryBooks.length === 0 ? (
        <Text style={{ color: '#888', marginTop: 20 }}>No books in your library yet.</Text>
      ) : (
        myLibraryBooks.map((book) => (
          <Card
            key={book.id}
            style={styles.bookCard}
            onPress={() => navigation.navigate('BookPreview', { bookId: book.id })}
          >
            <Card.Content>
              <Text style={styles.title}>{book.title}</Text>
              <Text>{book.author}</Text>
              {/* You can add more book details here if desired */}
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 60,
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  bookCard: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
