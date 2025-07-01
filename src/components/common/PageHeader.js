import React from 'react';
import { View, Text } from 'react-native';

export default function PageHeader({ children, style, containerStyle }) {
  return (
    <View
      style={[
        {
          marginTop: 48,         // Move down 10
          marginLeft: 0,        // Move right 15
          width: '100%',
          backgroundColor: '#f5f5f5',
          padding: 12,
        },
        containerStyle,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 26,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#222',
          },
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}