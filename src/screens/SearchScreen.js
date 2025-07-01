import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Searchbar, Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { books, searchBooks } from '../data/books';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  const popularBooks = books.filter(book => book.isPopular);

  const onChangeSearch = (text) => {
    setQuery(text);
    if (text.trim() === '') {
      setResults([]);
    } else {
      // Use the search function from books data
      const filtered = searchBooks(text);
      setResults(filtered);
    }
  };

  const handlePopularPress = (title) => {
    setQuery(title);
    onChangeSearch(title);
  };

  const handleBookPress = (bookId) => {
    navigation.navigate('BookPreview', { bookId });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by title or author"
        onChangeText={onChangeSearch}
        value={query}
        style={styles.searchbar}
      />

      {query.trim() === '' ? (
        <ScrollView style={styles.popularSection}>
          <Text style={styles.popularTitle}>📚 Browse Popular Books</Text>
          {popularBooks.map((book) => (
            <Card
              key={book.id}
              style={styles.popularCard}
              onPress={() => handleBookPress(book.id)}
            >
              <Card.Content>
                <View style={styles.bookContent}>
                  <Image source={{ uri: book.cover }} style={styles.bookCover} />
                  <View style={styles.bookInfo}>
                    <Text style={styles.title}>{book.title}</Text>
                    <Text style={styles.author}>{book.author}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.results}>
          {results.length > 0 ? (
            results.map((book) => (
              <Card 
                key={book.id} 
                style={styles.resultCard}
                onPress={() => handleBookPress(book.id)}
              >
                <Card.Content>
                  <View style={styles.bookContent}>
                    <Image source={{ uri: book.cover }} style={styles.bookCover} />
                    <View style={styles.bookInfo}>
                      <Text style={styles.title}>{book.title}</Text>
                      <Text style={styles.author}>{book.author}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.noResults}>No results found.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  searchbar: {
    marginTop: 60,
    marginBottom: 20,
  },
  popularSection: {
    marginTop: 10,
  },
  popularTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  popularCard: {
    marginBottom: 15,
  },
  results: {
    marginTop: 10,
  },
  resultCard: {
    marginBottom: 10,
  },
  noResults: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
  },
  bookContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bookCover: {
    width: 60,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
});
