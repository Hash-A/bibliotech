import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { books } from '../data/books';
import FeaturedBookCard from '../components/dashboard/FeaturedBookCard';
import MiniBookCard from '../components/bookCards/MiniBookCard';
import ContinueReadingSection from '../components/dashboard/ContinueReadingSection';

export default function DashboardScreen() {
  const navigation = useNavigation();

  // Get the first recommended book for "Our Picks"
  const ourPicks = books.filter(book => book.isRecommendation);
  const featuredBook = ourPicks[0];

  // Get books for "Continue Reading"
  const continueReadingBooks = books.filter(
    book => book.inMyLibrary && book.lastReadPage > 0
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>📚 Bibliotech</Text>

      {/* Featured Book Card */}
      <Text style={styles.sectionTitle}>🔥 Our Picks</Text>
      
      <FeaturedBookCard
        book={featuredBook}
        onPress={() => navigation.navigate('BookPreview', { bookId: featuredBook.id })}
      />

      {/* Continue Reading Section */}
      <ContinueReadingSection
        books={continueReadingBooks}
        onBookPress={(book) => navigation.navigate('BookPreview', { bookId: book.id })}
        styles={styles}
      />

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
