import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [squat, setSquat] = useState('');
  const [bench, setBench] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [total, setTotal] = useState(0);

  const handleSquatChange = async (text) => {
    setSquat(text);
    await AsyncStorage.setItem('squat', text);
  }

  const handleBenchChange = async (text) => {
    setBench(text);
    await AsyncStorage.setItem('bench', text);
  }

  const handleDeadliftChange = async (text) => {
    setDeadlift(text);
    await AsyncStorage.setItem('deadlift', text);
  }

  useEffect(() => {
    const newTotal = parseInt(squat) + parseInt(bench) + parseInt(deadlift);
    setTotal(newTotal);
  }, [squat, bench, deadlift]);

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
      <View style={styles.square}>
        <TextInput
          style={styles.input}
          value={squat}
          onChangeText={handleSquatChange}
          keyboardType='numeric'
        />
        <Text style={styles.text}>Squat</Text>
      </View>
      <View style={styles.square}>
        <TextInput
          style={styles.input}
          value={bench}
          onChangeText={handleBenchChange}
          keyboardType='numeric'
        />
        <Text style={styles.text}>Bench</Text>
      </View>
      <View style={styles.square}>
        <TextInput
          style={styles.input}
          value={deadlift}
          onChangeText={handleDeadliftChange}
          keyboardType='numeric'
        />
        <Text style={styles.text}>Deadlift</Text>
      </View>
      <View style={styles.square}>
        <Text style={styles.text}>Total</Text>
        <Text style={styles.value}>{total}</Text>
      </View>
      </View>
      <View style={styles.timerContainerContainer}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Timer</Text>
      </View>
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
  backgroundColor: '#F5FCFF'
  },
  inputView:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center'
  },
  square: {
  width: '35%',
  height: 150,
  backgroundColor: 'darkgray',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
  },
  input: {
  width: '80%',
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 10,
  padding: 10,
  },
  text: {
  fontSize: 20,
  },
  value: {
  fontSize: 30,
  fontWeight: 'bold',
  },
  timerContainer: {
  width: '100%',
  height: 100,
  backgroundColor: '#F5FCFF',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
  },
  timerContainerContainer: {
    flex: 1,
    flexDirection: 'column'
    },
  timerText: {
  fontSize: 30,
  fontWeight: 'bold',
  }
  });
export default HomeScreen;