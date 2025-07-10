import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { getBookById } from '../data/books'; // Keep getBookById for now
import { BooksContext } from '../context/BooksContext'; // Add context import
import ViewButton from '../components/common/ViewButton';
import AddToLibraryButton from '../components/common/AddToLibraryButton';
import BookHeader from '../components/bookPreview/BookHeader'; // Add this import
import BookDetails from '../components/bookPreview/BookDetails'; // Add this import

export default function BookPreviewScreen({ route, navigation }) {
  const { book: initialBook } = route.params || {};
  const { allBooks, setBookInLibrary, downloadBook } = useContext(BooksContext);

  // Get the fresh book data from context instead of using route.params
  const book = allBooks.find(b => b.id === initialBook.id) || initialBook;

  const handleAddToLibrary = async () => {
    if (!book.inLibrary) {
      // Only download if we're adding to library (not removing)
      try {
        await setBookInLibrary(book.id, true);
        // Download the book after adding to library
        await downloadBook(book.id, book.downloadUrl);
      } catch (error) {
        console.error('Error adding book to library:', error);
        // If download fails, we might want to show an error message to the user
        Alert.alert(
          'Download Error',
          'Failed to download book. Please check your internet connection and try again.'
        );
        // Optionally revert the library status if download failed
        await setBookInLibrary(book.id, false);
      }
    } else {
      // Just remove from library if that's what we're doing
      await setBookInLibrary(book.id, false);
    }
  };

  const handleReadBook = () => {
    if (book.inLibrary !== 0) {
      setBookInLibrary(book.id, 2);
    }
    navigation.navigate('Reader', { book });
  };

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text>Book not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Book Header*/}
      <BookHeader book={book} />
      
      <Divider style={{marginVertical: 16}} />

      {/* Book Details */}
      <BookDetails book={book} />

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AddToLibraryButton
          onPress={handleAddToLibrary}
          inLibrary={Boolean(book.inLibrary)}
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
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
});