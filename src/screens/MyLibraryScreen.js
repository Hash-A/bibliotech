import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BooksContext } from '../context/BooksContext';
import StandardBookCard from '../components/bookCards/StandardBookCard';
import { theme } from '../styles/theme';

export default function MyLibraryScreen() {
  const navigation = useNavigation();
  const { allBooks } = useContext(BooksContext);
  const [myLibraryBooks, setMyLibraryBooks] = useState([]);

  useEffect(() => {
    setMyLibraryBooks(allBooks.filter(book => book.inLibrary));
  }, [allBooks]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Library</Text>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {myLibraryBooks.length === 0 ? (
          <Text style={styles.emptyLibrary}>No books in your library yet.</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  header: {
    ...theme.typography.header,
    color: theme.colors.text.primary,
    marginTop: 70,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  emptyLibrary: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
