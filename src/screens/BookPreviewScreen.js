import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { getBookById } from '../data/books'; // Keep getBookById for now
import { BooksContext } from '../context/BooksContext'; // Add context import
import ViewButton from '../components/common/ViewButton';
import AddToLibraryButton from '../components/common/AddToLibraryButton';
import BookHeader from '../components/bookPreview/BookHeader'; // Add this import
import BookDetails from '../components/bookPreview/BookDetails'; // Add this import

export default function BookPreviewScreen({ route, navigation }) {
  const { bookId } = route.params || {};
  const { books, setBookInLibrary } = useContext(BooksContext);
  
  // Get the fresh book data from context instead of using getBookById
  const book = books.find(book => book.id === bookId);

  const handleAddToLibrary = () => {
    setBookInLibrary(bookId, true);
  };

  const handleReadBook = () => {
    navigation.navigate('Reader', { bookId });
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
      
      <Divider style={styles.divider} />

      {/* Book Details */}
      <BookDetails book={book} />

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AddToLibraryButton
          onPress={handleAddToLibrary}
          inLibrary={book.inMyLibrary || false}
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
  divider: {
    marginVertical: 16,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
});