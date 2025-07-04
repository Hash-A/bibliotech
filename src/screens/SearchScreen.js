import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BooksContext } from '../context/BooksContext';
import SearchBar from '../components/search/SearchBar';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { allBooks, getBooks } = useContext(BooksContext);

  const popularBooks = allBooks.filter(book => book.isPopular);

  // Debounce: delay search until typing stops
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }

      setLoading(true);
      getBooks(query).then((books) => {
        setResults(books);
        setLoading(false);
      }).catch(err => {
        console.error('Search failed:', err);
        setLoading(false);
      });

    }, 300); // debounce delay

    return () => clearTimeout(timeout);
  }, [query]);

  const handlePopularPress = (title) => {
    setQuery(title);
  };

  const handleBookPress = (bookId) => {
    navigation.navigate('BookPreview', { bookId });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        onChangeText={setQuery}
        value={query}
      />

      {query.trim() === '' ? (
        <ScrollView style={styles.popularSection}>
          <Text style={styles.popularTitle}>Browse Popular Books</Text>
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
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : results.length > 0 ? (
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
    width: 90,
    height: 120,
    borderRadius: 2,
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
