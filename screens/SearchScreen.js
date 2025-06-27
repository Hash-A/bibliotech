import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Searchbar, Card, Button, Text } from 'react-native-paper';

const popularBooks = [
  { title: '1984', author: 'George Orwell' },
  { title: 'Moby Dick', author: 'Herman Melville' },
  { title: 'Don Quixote', author: 'Miguel de Cervantes' },
];

const dummyResults = [
  { title: 'Frankenstein', author: 'Mary Shelley' },
  { title: 'The Odyssey', author: 'Homer' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const onChangeSearch = (text) => {
    setQuery(text);
    if (text.trim() === '') {
      setResults([]);
    } else {
      // simulate search
      const filtered = dummyResults.filter((book) =>
        book.title.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handlePopularPress = (title) => {
    setQuery(title);
    onChangeSearch(title);
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
          {popularBooks.map((book, idx) => (
            <Card
              key={idx}
              style={styles.popularCard}
              onPress={() => handlePopularPress(book.title)}
            >
              <Card.Content>
                <Text style={styles.title}>{book.title}</Text>
                <Text>{book.author}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.results}>
          {results.length > 0 ? (
            results.map((book, idx) => (
              <Card key={idx} style={styles.resultCard}>
                <Card.Content>
                  <Text style={styles.title}>{book.title}</Text>
                  <Text>{book.author}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
