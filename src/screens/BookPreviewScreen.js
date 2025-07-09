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
  const { book: initialBook } = route.params || {};
  const { allBooks, setBookInLibrary } = useContext(BooksContext);

  // Get the fresh book data from context instead of using route.params
  const book = allBooks.find(b => b.id === initialBook.id) || initialBook;

  const handleAddToLibrary = () => {
    setBookInLibrary(book.id, !Boolean(book.inLibrary));
  };

  const handleReadBook = () => {
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