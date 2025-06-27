import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Title, Button, Avatar, Divider } from 'react-native-paper';

const sampleCover = 'https://picsum.photos/200/300'; // Replace with real image URL or asset

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Title style={styles.header}>📚 Bibliotech</Title>

      {/* Featured Book Card */}
      <Text style={styles.sectionTitle}>🔥 Our Picks</Text>
      <Card style={styles.featuredCard}>
        <Card.Cover source={{ uri: sampleCover }} />
        <Card.Content>
          <Title>Sample Book Title</Title>
          <Text>By Author Name</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => {}}>Read</Button>
          <Button onPress={() => {}}>Listen</Button>
        </Card.Actions>
      </Card>

      {/* Recently Opened Books */}
      <Text style={styles.sectionTitle}>📖 Recently Opened</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentList}>
        {[1, 2, 3].map((num) => (
          <Card key={num} style={styles.miniCard}>
            <Card.Cover source={{ uri: sampleCover }} style={styles.miniCover} />
            <Card.Content>
              <Title style={styles.miniTitle}>Book {num}</Title>
            </Card.Content>
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
});
