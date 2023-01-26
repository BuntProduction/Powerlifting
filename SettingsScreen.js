import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import StatusBar from './MyStatusBar';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={
          require('./img/SBDPerf4.png')} 
          style={{  width: 140,
            height: 140,
            resizeMode: 'contain',
            marginTop: '-10%'
                }}/>
      <Text>Bienvenue sur l'écran des settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white'
  },
})

export default SettingsScreen;
