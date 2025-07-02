import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BooksContext } from '../context/BooksContext';
import FeaturedBookCard from '../components/dashboard/FeaturedBookCard';
import SectionTitle from '../components/common/SectionTitle';
import PageHeader from '../components/common/PageHeader';
import ContinueReadingSection from '../components/dashboard/ContinueReadingSection';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { books } = useContext(BooksContext);

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
  settingsButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
});
