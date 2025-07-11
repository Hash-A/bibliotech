import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Card, Text, Divider, Button } from 'react-native-paper';
import { getBookById } from '../data/books';
import { BooksContext } from '../context/BooksContext';
import ViewButton from '../components/common/ViewButton';
import AddToLibraryButton from '../components/common/AddToLibraryButton';
import BookHeader from '../components/bookPreview/BookHeader';
import BookDetails from '../components/bookPreview/BookDetails';
import { theme } from '../styles/theme';

export default function BookPreviewScreen({ route, navigation }) {
  const { allBooks, books: searchResults, setBookInLibrary, downloadBook } = useContext(BooksContext);
  
  // Safely get the book from route params
  const initialBook = route.params?.book;
  if (!initialBook) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Book not found.</Text>
      </View>
    );
  }

  // Get the fresh book data from context, checking both allBooks and searchResults
  const bookFromAll = allBooks.find(b => b.id === initialBook.id);
  const bookFromSearch = searchResults.find(b => b.id === initialBook.id);
  const book = bookFromAll || bookFromSearch || initialBook;

  console.log('Current book state:', {
    id: book.id,
    title: book.title,
    inLibrary: book.inLibrary,
    fromAllBooks: !!bookFromAll,
    fromSearchResults: !!bookFromSearch
  });

  // Local loading state for add-to-library
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToLibrary = async () => {
    if (isAdding) return; // debounce rapid presses
    setIsAdding(true);
    try {
      const newStatus = book.inLibrary > 0 ? 0 : 1;
      console.log('Attempting to change library status:', {
        bookId: book.id,
        currentStatus: book.inLibrary,
        newStatus: newStatus
      });

      await setBookInLibrary(book.id, newStatus);
      console.log('setBookInLibrary completed');
      
      if (newStatus === 1) {
        console.log('Attempting to download book:', book.id);
        await downloadBook(book.id, book.downloadUrl);
        console.log('Book download completed');
      }
    } catch (error) {
      console.error('Error in handleAddToLibrary:', error);
      Alert.alert(
        'Error',
        'Failed to update library status. Please try again.'
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromLibrary = async () => {
    try {
      console.log('Attempting to remove book from library:', book.id);
      await setBookInLibrary(book.id, 0);
      console.log('Book removed from library');
    } catch (error) {
      console.error('Error removing book from library:', error);
      Alert.alert(
        'Error',
        'Failed to remove book from library. Please try again.'
      );
    }
  };

  const handleReadBook = () => {
    if (book.inLibrary !== 0) {
      setBookInLibrary(book.id, 2);
    }
    navigation.navigate('Reader', { book });
  };

  const isInLibrary = book.inLibrary > 0;

  return (
    <ScrollView style={styles.container}>
      <BookHeader book={book} />
      
      <Divider style={styles.divider} />

      <BookDetails book={book} />

      <View style={styles.actions}>
        <AddToLibraryButton
          onPress={handleAddToLibrary}
          inLibrary={book.inLibrary || 0}
          loading={isAdding}
        />
        {isInLibrary && (
          <Button
            mode="outlined"
            icon="delete"
            onPress={handleRemoveFromLibrary}
            style={styles.removeButton}
            textColor={theme.colors.error}
          >
            Remove from Library
          </Button>
        )}
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
  removeButton: {
    borderColor: theme.colors.error,
  },
});