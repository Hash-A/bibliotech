import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../../styles/theme';

export default function PageHeader({ children, style, containerStyle }) {
  return (
    <View
      style={[
        {
          paddingTop: theme.spacing.xl + theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          width: '100%',
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        containerStyle,
      ]}
    >
      <Text
        style={[
          {
            ...theme.typography.header,
            color: theme.colors.text.primary,
            textAlign: 'center',
          },
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}