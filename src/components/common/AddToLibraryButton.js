import React from 'react';
import { Button } from 'react-native-paper';

export default function AddToLibraryButton({ onPress, inLibrary, style }) {
  return (
    <Button
      mode={inLibrary ? "outlined" : "contained"}
      icon={inLibrary ? "check" : "plus"}
      style={style}
      onPress={onPress}
      disabled={inLibrary}
    >
      {inLibrary ? "Added to Library" : "Add to Library"}
    </Button>
  );
}