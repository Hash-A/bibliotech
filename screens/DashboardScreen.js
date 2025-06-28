import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Avatar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { featuredBook } from '../data/books';

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>📚 Bibliotech</Text>

      {/* Featured Book Card */}
      <Text style={styles.sectionTitle}>🔥 Our Picks</Text>
      <Card style={styles.featuredCard}>
        <Card.Cover source={{ uri: featuredBook.cover }} />
        <Card.Content>
          <Text style={styles.title}>{featuredBook.title}</Text>
          <Text>By {featuredBook.author}</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('BookPreview', { book: featuredBook })}>View</Button>
          <Button onPress={() => {}}>Add to Library</Button>
        </Card.Actions>
      </Card>

      {/* Recently Opened Books */}
      <Text style={styles.sectionTitle}>📖 Continue Reading </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentList}>
        {[1, 2, 3].map((num) => (
          <Card key={num} style={styles.miniCard}>
            <Card.Cover source={{ uri: featuredBook.cover }} style={styles.miniCover} />
            <Card.Content>
              <Text style={styles.miniTitle}>Book {num}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('BookPreview', { book: { ...featuredBook, title: `Book ${num}` } })}>View</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Divider style={{ marginVertical: 20 }} />

      {/* Settings Button */}
      <Button
        icon="cog"
        mode="outlined"
        style={styles.settingsButton}
        onPress={() => console.log('Navigate to Settings')}
      >
        Settings
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginTop: 60,
    fontSize: 26,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  featuredCard: {
    marginBottom: 10,
  },
  recentList: {
    flexDirection: 'row',
  },
  miniCard: {
    width: 120,
    marginRight: 12,
  },
  miniCover: {
    height: 140,
  },
  miniTitle: {
    fontSize: 14,
  },
  settingsButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
