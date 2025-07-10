import React, { useState, useEffect, useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text, Card, Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BooksContext } from "../context/BooksContext";
import FeaturedBookCard from "../components/dashboard/FeaturedBookCard";
import SectionTitle from "../components/common/SectionTitle";
import PageHeader from "../components/common/PageHeader";
import ContinueReadingSection from "../components/dashboard/ContinueReadingSection";
import SettingsButton from "../components/common/SettingsButton";

export default function DashboardScreen() {
    const navigation = useNavigation();
    const { allBooks } = useContext(BooksContext); // should not be a constant array, should be fetched from some DB
    const [continueReadingBooks, setContinueReading] = useState([]);
    const books = allBooks;

    // const { booksFetcher } = useContext(BooksContext) ; // booksFetcher: () => book[] is a function that sends api request (might need backend if i am pulling from multiple websites)
    // const books = booksFetcher();
    // Get the first recommended book for "Our Picks"

    const ourPicks = books.filter((book) => book.isRecommendation);
    console.log('Our Picks:', ourPicks); // Add this line
    const featuredBook = ourPicks[0]; // if i have multiple books to possibly recommend ourPicks[number.rand()];

    // Get books for "Continue Reading"
    useEffect(() => {
        if (!allBooks || allBooks.length === 0) return;
    
        // Clone and sort books from largest to smallest by inLibrary
        const sorted = [...allBooks].sort((a, b) => Number(b.inLibrary) - Number(a.inLibrary));
    
        // Take up to 4 books where inLibrary !== '1'
        const filteredTop = [];
        for (const book of sorted) {
            if (book.inLibrary <= 1) break;
            filteredTop.push(book);
            if (filteredTop.length === 4) break;
        }
    
        // Do something with filteredTop
        // console.log("Top books:", filteredTop);
        setContinueReading(filteredTop);
    
    }, [allBooks]);

    

    const handleSettingsPress = () => {
        // console.log('Navigate to Settings');
        // You can add actual navigation here later
        // navigation.navigate('Settings');
    };

    return (
        <>
            <PageHeader> Bibliotech</PageHeader>
            <ScrollView style={styles.container}>
                {/* Featured Book Card */}
                <SectionTitle>Our Picks</SectionTitle>

                <FeaturedBookCard
                    book={featuredBook}
                    onPress={() =>
                        navigation.navigate("BookPreview", {
                            bookId: featuredBook.id,
                        })
                    }
                />

                {/* <Divider style={{ marginVertical: 20 }} /> */}

                {/* Continue Reading Section (inlined) */}
                <SectionTitle style={{ marginTop: 20 }}>
                    Continue Reading{" "}
                </SectionTitle>

                <ContinueReadingSection
                    books={continueReadingBooks}
                    onBookPress={(book) =>
                        navigation.navigate("BookPreview", { book: book })
                    }
                    styles={styles.continueReadingStyles}
                />

                <Divider style={{ marginVertical: 20 }} />

                {/* Settings Button */}
                <SettingsButton onPress={handleSettingsPress} />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 20,
    },
    continueReadingStyles: {
        miniCard: {
            width: 110,
            marginRight: 15,
            marginVertical: 10,
            elevation: 4,
            backgroundColor: '#fff',
        },
        miniCover: {
            width: '100%',
            height: 150,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
        },
        miniTitle: {
            fontSize: 14,
            marginTop: 8,
            marginBottom: 4,
            numberOfLines: 2,
        },
    },
});
