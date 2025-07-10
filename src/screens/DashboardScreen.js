import React, { useState, useEffect, useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Card, Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BooksContext } from "../context/BooksContext";
import FeaturedBookCard from "../components/dashboard/FeaturedBookCard";
import SectionTitle from "../components/common/SectionTitle";
import PageHeader from "../components/common/PageHeader";
import ContinueReadingSection from "../components/dashboard/ContinueReadingSection";
import SettingsButton from "../components/common/SettingsButton";
import { theme } from "../styles/theme";

export default function DashboardScreen() {
    const navigation = useNavigation();
    const { allBooks } = useContext(BooksContext);
    const [continueReadingBooks, setContinueReading] = useState([]);
    const books = allBooks;

    const ourPicks = books.filter((book) => book.isRecommendation);
    const featuredBook = ourPicks[0];

    useEffect(() => {
        if (!allBooks || allBooks.length === 0) return;
        const sorted = [...allBooks].sort((a, b) => Number(b.inLibrary) - Number(a.inLibrary));
        const filteredTop = [];
        for (const book of sorted) {
            if (book.inLibrary <= 1) break;
            filteredTop.push(book);
            if (filteredTop.length === 4) break;
        }
        setContinueReading(filteredTop);
    }, [allBooks]);

    const handleSettingsPress = () => {
        // Navigation to settings
    };

    return (
        <View style={styles.mainContainer}>
            <PageHeader>Bibliotech</PageHeader>
            <ScrollView 
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <SectionTitle>Our Picks</SectionTitle>

                <FeaturedBookCard
                    book={featuredBook}
                    onPress={() =>
                        navigation.navigate("BookPreview", {
                            book: featuredBook
                        })
                    }
                    style={styles.featuredCard}
                />

                <SectionTitle style={styles.sectionSpacing}>
                    Continue Reading
                </SectionTitle>

                <ContinueReadingSection
                    books={continueReadingBooks}
                    onBookPress={(book) =>
                        navigation.navigate("BookPreview", { book: book })
                    }
                    styles={styles.continueReadingStyles}
                />

                <Divider style={styles.divider} />

                <SettingsButton onPress={handleSettingsPress} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: theme.spacing.md,
    },
    sectionSpacing: {
        marginTop: theme.spacing.md,
    },
    featuredCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    divider: {
        marginVertical: theme.spacing.xl,
    },
    continueReadingStyles: {
        miniCard: {
            width: 130,
            marginLeft: 10,
            marginVertical: 0,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        miniCover: {
            width: '100%',
            height: 180,
            borderTopLeftRadius: theme.borderRadius.md,
            borderTopRightRadius: theme.borderRadius.md,
        },
        miniTitle: {
            ...theme.typography.subtitle,
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
            color: theme.colors.text.primary,
        },
    },
});
