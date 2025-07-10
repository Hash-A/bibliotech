import React from 'react';
import { Text } from 'react-native';
import { theme } from '../../styles/theme';

export default function SectionTitle({ children, style }) {
  return (
    <Text 
      style={[
        { 
          ...theme.typography.title,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.md,
        }, 
        style
      ]}
    >
      {children}
    </Text>
  );
}
