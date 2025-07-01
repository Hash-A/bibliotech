import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { getBookById, setBookInLibrary } from '../data/books'; // <-- Import the helper
import ViewButton from '../components/common/ViewButton';
import AddToLibraryButton from '../components/common/AddToLibraryButton';

export default function BookPreviewScreen({ route, navigation }) {
  const { bookId } = route.params || {}; // Expecting bookId to be passed in navigation
  const book = getBookById(bookId);

  // Use the real inMyLibrary status from the book data
  const [isInLibrary, setIsInLibrary] = useState(book?.inMyLibrary || false);

  // Handler to "add" the book to the library (demo: only updates local state)
  const handleAddToLibrary = () => {
    setBookInLibrary(bookId, true); // Update the "database"
    setIsInLibrary(true);           // Update local state for UI
  };

  const handleReadBook = () => {
    navigation.navigate('Reader', { bookId });
  };

  if (!book) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Book not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Book Cover and Basic Info */}
      <View style={styles.header}>
        <Image source={{ uri: book.cover }} style={styles.cover} />
        <View style={styles.basicInfo}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
          <Text style={styles.publishDate}>Published: {book.publishDate}</Text>
          <Text style={styles.genre}>{book.genres?.join(', ')}</Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Book Details */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{book.summary}</Text>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.detail}>ISBN: {book.isbn}</Text>
          <Text style={styles.detail}>Pages: {book.pages}</Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AddToLibraryButton
          onPress={handleAddToLibrary}
          inLibrary={isInLibrary}
          style={styles.addButton}
        />
        <ViewButton
          onPress={handleReadBook}
          style={styles.readButton}
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
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 80,
  },
  cover: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginRight: 16,
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  publishDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: '#888',
  },
  divider: {
    marginVertical: 16,
  },
  detailsCard: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  addButton: {
    marginBottom: 8,
  },
  readButton: {
    marginBottom: 8,
  },
});