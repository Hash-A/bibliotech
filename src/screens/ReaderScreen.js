import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getBookById } from '../data/books';

export default function ReaderScreen({ route }) {
  const { bookId } = route.params || {};
  const book = getBookById(bookId);

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Book not found.</Text>
      </View>
    );
  }

  const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Sed sed nunc nec velit finibus finibus. Proin porta urna a malesuada malesuada. 
  Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
  
  (More book content would appear here.)`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.content}>{content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
