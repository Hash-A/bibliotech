import React from 'react';
import { Text } from 'react-native';

export default function SectionTitle({ children, style }) {
  return (
    <Text style={[{ fontSize: 18, marginTop: 20, marginBottom: 10, fontWeight: '600' }, style]}>
      {children}
    </Text>
  );
}
