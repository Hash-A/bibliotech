import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';

export default function ReaderScreen({ route }) {
  const { book } = route.params || {};
  const title = book?.title || 'No Title';
  const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Sed sed nunc nec velit finibus finibus. Proin porta urna a malesuada malesuada. 
  Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
  
  (More book content would appear here.)`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>{title}</Title>
      <Paragraph style={styles.content}>{content}</Paragraph>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
