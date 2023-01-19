import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatusBar from './MyStatusBar';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Bienvenue sur l'écran des settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
})

export default SettingsScreen;
