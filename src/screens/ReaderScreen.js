import React, { useState, useContext, useEffect } from 'react';
import { BooksContext } from '../context/BooksContext';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getBookById } from '../data/books';

export default function ReaderScreen({ route }) {
  const { bookId } = route.params || {};
  const { allBooks, downloadBook, getDownloadedBookContent } = useContext(BooksContext);

  const book = getBookById(allBooks, bookId);

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Book not found.</Text>
      </View>
    );
  }

  const [content, setContent] = useState("loading...");

  useEffect(() => {
    if (book.downloaded !== 1) {
      downloadBook(bookId, book.downloadUrl).then(()=>{
        getDownloadedBookContent(bookId).then((newContent) => {
          setContent(newContent);
        });
    
      });
    } else {
      getDownloadedBookContent(bookId).then((newContent) => {
        setContent(newContent);
      });
    }
  }, []);

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
