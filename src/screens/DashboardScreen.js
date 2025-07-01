import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { books } from '../data/books';
import FeaturedBookCard from '../components/dashboard/FeaturedBookCard';
import SectionTitle from '../components/common/SectionTitle';
import PageHeader from '../components/common/PageHeader';
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
    <>
      <PageHeader> Bibliotech</PageHeader>
      <ScrollView style={styles.container}>
        {/* Featured Book Card */}
        <SectionTitle>Our Picks</SectionTitle>
        
        <FeaturedBookCard
          book={featuredBook}
          onPress={() => navigation.navigate('BookPreview', { bookId: featuredBook.id })}
        />

        {/* <Divider style={{ marginVertical: 20 }} /> */}

        {/* Continue Reading Section (inlined) */}
        <SectionTitle style={{ marginTop: 20 }} >Continue Reading </SectionTitle>
        
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
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
    margin: 12
  },
  miniCover: {
    height: 150,
  },
  miniTitle: {
    marginVertical: 10,
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
