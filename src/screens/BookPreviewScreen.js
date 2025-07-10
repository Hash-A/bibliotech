import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { getBookById } from '../data/books';
import { BooksContext } from '../context/BooksContext';
import ViewButton from '../components/common/ViewButton';
import AddToLibraryButton from '../components/common/AddToLibraryButton';
import BookHeader from '../components/bookPreview/BookHeader';
import BookDetails from '../components/bookPreview/BookDetails';
import { theme } from '../styles/theme';

export default function BookPreviewScreen({ route, navigation }) {
  const { allBooks, setBookInLibrary, downloadBook } = useContext(BooksContext);
  
  // Safely get the book from route params
  const initialBook = route.params?.book;
  if (!initialBook) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Book not found.</Text>
      </View>
    );
  }

  // Get the fresh book data from context
  const book = allBooks.find(b => b.id === initialBook.id) || initialBook;

  const handleAddToLibrary = async () => {
    try {
      const newStatus = book.inLibrary > 0 ? 0 : 1;
      await setBookInLibrary(book.id, newStatus);
      
      if (newStatus === 1) {
        await downloadBook(book.id, book.downloadUrl);
      }
    } catch (error) {
      console.error('Error managing library status:', error);
      Alert.alert(
        'Error',
        'Failed to update library status. Please try again.'
      );
    }
  };

  const handleReadBook = () => {
    if (book.inLibrary !== 0) {
      setBookInLibrary(book.id, 2);
    }
    navigation.navigate('Reader', { book });
  };

  return (
    <ScrollView style={styles.container}>
      <BookHeader book={book} />
      
      <Divider style={styles.divider} />

      <BookDetails book={book} />

      <View style={styles.actions}>
        <AddToLibraryButton
          onPress={handleAddToLibrary}
          inLibrary={book.inLibrary || 0}
        />
        <ViewButton
          onPress={handleReadBook}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  actions: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
});