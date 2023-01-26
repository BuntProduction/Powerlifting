import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Button  } from 'react-native';
import StatusBar from './MyStatusBar';

const SettingsScreen = () => {

  const [weight, setWeight] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [oneRm, setOneRm] = useState('');

  function calculateOneRm() {
  const w = parseFloat(weight);
  const r = parseFloat(repetitions);
  const calculatedOneRm = w * (1 + (r / 30));
  setOneRm(calculatedOneRm);
  }


  return (
    <View style={styles.container}>
      <StatusBar />
      <Image source={
          require('./img/SBDPerf4.png')} 
          style={{  width: 140,
            height: 140,
            resizeMode: 'contain',
            marginTop: '-10%'
                }}/>


<View>
      <Text>Enter weight:</Text>
      <TextInput
        value={weight}
        onChangeText={text => setWeight(text)}
      />

        <Text>Enter repetitions:</Text>
        <TextInput
          value={repetitions}
          onChangeText={text => setRepetitions(text)}
        />
        <Button
          title="Calculate"
          onPress={() => calculateOneRm()}
        />
        <Text>One Rep Max: {oneRm}</Text>
        </View>

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
