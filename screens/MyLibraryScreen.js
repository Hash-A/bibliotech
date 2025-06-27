import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const books = [
  {
    id: 1,
    title: 'The Republic',
    author: 'Plato',
    downloaded: true,
    hasAudio: true,
  },
  {
    id: 2,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    downloaded: false,
    hasAudio: false,
  },
  {
    id: 3,
    title: 'Frankenstein',
    author: 'Mary Shelley',
    downloaded: true,
    hasAudio: false,
  },
];

export default function MyLibraryScreen() {
    const navigation = useNavigation();
    return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📖 My Library</Text>
        {books.map((book) => (
        <Card
            key={book.id}
            style={styles.bookCard}
            onPress={() => navigation.navigate('Reader', { book })}
        >
            <Card.Content>
            <Text style={styles.title}>{book.title}</Text>
            <Text>{book.author}</Text>
            <Text style={styles.status}>
                {book.downloaded ? '✅ Downloaded' : '❌ Not Downloaded'}{"   "}
                {book.hasAudio ? '🎧 Audiobook' : '🚫 No Audiobook'}
            </Text>
            </Card.Content>
        </Card>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 60,
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  bookCard: {
    marginBottom: 15,
  },
  status: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
