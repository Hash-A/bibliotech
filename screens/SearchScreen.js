import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, Text } from 'react-native-paper';

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
        <View style={styles.popularSection}>
          <Text style={styles.popularTitle}>📚 Browse Popular Books</Text>
          {popularBooks.map((book, idx) => (
            <Button
              key={idx}
              mode="outlined"
              style={styles.popularButton}
              onPress={() => handlePopularPress(book.title)}
            >
              {book.title}
            </Button>
          ))}
        </View>
      ) : (
        <ScrollView style={styles.results}>
          {results.length > 0 ? (
            results.map((book, idx) => (
              <Card key={idx} style={styles.resultCard}>
                <Card.Content>
                  <Title>{book.title}</Title>
                  <Paragraph>{book.author}</Paragraph>
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
  popularButton: {
    marginVertical: 5,
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
});
