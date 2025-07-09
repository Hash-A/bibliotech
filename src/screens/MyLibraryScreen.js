import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BooksContext } from '../context/BooksContext';
import StandardBookCard from '../components/bookCards/StandardBookCard';

export default function MyLibraryScreen() {
  const navigation = useNavigation();
  const { allBooks } = useContext(BooksContext);
  const [myLibraryBooks, setMyLibraryBooks] = useState([]);

  const books = allBooks;

  // let myLibraryBooks = [];
  useEffect(() => {
    console.log("entered mylibrary");
    setMyLibraryBooks(allBooks.filter(book => book.inLibrary));
  }, [allBooks])

  // Only show books that are in the user's library

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Library</Text>
      {myLibraryBooks.length === 0 ? (
        <Text style={{ color: '#888', marginTop: 20 }}>No books in your library yet.</Text>
      ) : (
        myLibraryBooks.map((book) => (
          <StandardBookCard
            key={book.id}
            book={book}
            onPress={() => navigation.navigate('BookPreview', { book: book })}
          />
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
