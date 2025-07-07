import React from 'react';
import { Button } from 'react-native-paper';

export default function ViewButton({ onPress, style }) {
  return (
    <Button
      mode="contained"
      icon="eye"
      style={style}
      onPress={onPress}
    >
      View
    </Button>
  );
}