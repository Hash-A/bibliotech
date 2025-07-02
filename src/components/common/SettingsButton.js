import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function SettingsButton({ onPress }) {
  return (
    <Button
      icon="cog"
      mode="outlined"
      style={styles.settingsButton}
      onPress={onPress}
    >
      Settings
    </Button>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
});
