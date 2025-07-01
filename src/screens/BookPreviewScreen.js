import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Card, Text, Button, Divider } from 'react-native-paper';

export default function BookPreviewScreen({ route, navigation }) {
  const { book } = route.params || {};
  const [isInLibrary, setIsInLibrary] = useState(false);

  // Sample book data - in a real app, this would come from an API or database
  const bookData = {
    title: book?.title || 'Sample Book Title',
    author: book?.author || 'Author Name',
    cover: 'https://picsum.photos/300/400', // Replace with actual cover image
    publishDate: 'January 15, 2023',
    summary: `This is a compelling story that explores themes of love, loss, and redemption. 
    
    The narrative follows the journey of our protagonist as they navigate through life's challenges and discover the true meaning of happiness. With rich character development and vivid descriptions, this book will keep you engaged from the first page to the last.
    
    Set against the backdrop of a changing world, the story weaves together multiple plot lines that converge in unexpected ways, creating a reading experience that is both thought-provoking and entertaining.`,
    isbn: '978-0-123456-78-9',
    pages: 320,
    genre: 'Fiction',
  };

  const handleAddToLibrary = () => {
    setIsInLibrary(true);
    // Here you would typically add the book to the user's library in your app's state/database
    console.log('Added to library:', bookData.title);
  };

  const handleReadBook = () => {
    navigation.navigate('Reader', { book: bookData });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Book Cover and Basic Info */}
      <View style={styles.header}>
        <Image source={{ uri: bookData.cover }} style={styles.cover} />
        <View style={styles.basicInfo}>
          <Text style={styles.title}>{bookData.title}</Text>
          <Text style={styles.author}>by {bookData.author}</Text>
          <Text style={styles.publishDate}>Published: {bookData.publishDate}</Text>
          <Text style={styles.genre}>{bookData.genre}</Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Book Details */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>📖 Summary</Text>
          <Text style={styles.summary}>{bookData.summary}</Text>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>📋 Details</Text>
          <Text style={styles.detail}>ISBN: {bookData.isbn}</Text>
          <Text style={styles.detail}>Pages: {bookData.pages}</Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {!isInLibrary ? (
          <Button
            mode="contained"
            icon="plus"
            style={styles.addButton}
            onPress={handleAddToLibrary}
          >
            Add to Library
          </Button>
        ) : (
          <Button
            mode="outlined"
            icon="check"
            style={styles.addedButton}
            disabled
          >
            Added to Library
          </Button>
        )}
        
        <Button
          mode="outlined"
          icon="book-open-variant"
          style={styles.readButton}
          onPress={handleReadBook}
        >
          Read Book
        </Button>
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
    margin: 16,
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
  addedButton: {
    marginBottom: 8,
  },
  readButton: {
    marginBottom: 8,
  },
});