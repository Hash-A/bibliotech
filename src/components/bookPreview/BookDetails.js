import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';

export default function BookDetails({ book }) {
  return (
    <Card style={styles.detailsCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>📖 Summary</Text>
        <Text style={styles.summary}>{book.summary}</Text>
        
        <Divider style={styles.divider} />
        
        {/* <Text style={styles.sectionTitle}>📋 Details</Text>
        <Text style={styles.detail}>ISBN: {book.isbn}</Text>
        <Text style={styles.detail}>Pages: {book.pages}</Text> */}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  detailsCard: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
});
