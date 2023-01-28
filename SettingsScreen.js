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

  const weightInputRef = React.useRef(null);
  const repetitionsInputRef = React.useRef(null);

  const handleWeightPress = () => {
    weightInputRef.current.focus();
  };
  const handleRepetitionsPress = () => {
    repetitionsInputRef.current.focus();
  };

  return (
    <View style={styles.container}>
      <Image source={
          require('./img/SBDPerf4.png')} 
          style={{  width: 140,
            height: 140,
            marginTop: '-7.6%',
            position: 'absolute',
            top: 0
                }}/>

    <Text style={styles.titleCalculator}>1 Rep Max Calculator</Text>
    <View style={styles.containerItems}>
    <View style={styles.InputContainerContainer}>    
      <TouchableOpacity style={styles.inputContainer} onPress={handleWeightPress}>
        
        <Text style={styles.textEnter}>Enter weight:</Text>
        <TextInput
          ref={weightInputRef}
          defaultValue={'0'}
          onFocus={() => setWeight('')}
          onChangeText={text => setWeight(text)}
          style={styles.inputNumber}
          keyboardType='numeric'
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputContainer} onPress={handleRepetitionsPress}>
        <Text style={styles.textEnter}>Enter repetitions:</Text>
        <TextInput
          ref={repetitionsInputRef}
          defaultValue={'0'}
          onFocus={() => setRepetitions('')}
          onChangeText={text => setRepetitions(text)}
          style={styles.inputNumber}
          keyboardType='numeric'
        />
      </TouchableOpacity>
      </View>

        <TouchableOpacity
          title="Calculate"
          onPress={() => calculateOneRm()}
          style={styles.calculateButton}
        ><Text style={{fontWeight: 'bold', fontSize: 18, textAlign: 'center'}}>Calculate</Text></TouchableOpacity>
        <Text style={styles.oneRepMaxText}>One Rep Max: <Text style={styles.oneRmResult}>{parseFloat(oneRm ? oneRm : '0').toFixed(1)}</Text></Text>
        
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  titleCalculator:{
    fontSize: 30,
    marginBottom: '15%',
    fontWeight: 'bold',
    
  },
  containerItems:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  inputContainerContainer:{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  },
  inputContainer:{
    shadowColor: 'black',
      shadowOffset: { 
        width: 0, 
        height: 11 },
      shadowOpacity: 0.16,
     shadowRadius: 16,
      elevation: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      padding: '3%',
      margin: '1%',
      borderRadius: 5
  },
  textEnter:{
    fontSize: 20,
  },
  oneRepMaxText:{
    fontSize: 20,
  },
  oneRmResult:{
    fontWeight: 'bold',

  },
  inputNumber:{
    fontSize: 20, 
    width: 50, 
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  calculateButton:{
    marginTop: '5%',
    padding: 10,
    width: '30%',
    shadowColor: 'black',
      shadowOffset: { 
        width: 0, 
        height: 11 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: '5%',
    borderRadius: 45,

  },
})

export default SettingsScreen;
