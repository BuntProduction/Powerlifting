import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Entypo } from '@expo/vector-icons';

import { useWindowDimensions } from 'react-native';
import StatusBar from './MyStatusBar';

//design blanc avec une sorte de lévitation des carrés avec des shadows
const HomeScreen = () => {
  
  const { width, height } = useWindowDimensions();
  const squareSize = width * 0.4; // 40% of the window width

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


  // Timer Part //
  const [timeLeft, setTimeLeft] = useState(3 * 60); // 3 minutes in seconds
  const [timerId, setTimerId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handlePlayPress = () => {
    if (!isRunning) {
      setIsRunning(true);
      const id = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
        if (timeLeft <= 0) {
          clearInterval(id);
          setIsRunning(false);
        }
      }, 1000);
      setTimerId(id);
    }
  };

  const handleStopPress = () => {
    clearInterval(timerId);
    setIsRunning(false);
  };
  const handleResetPress = () => {
    clearInterval(timerId);
    setIsRunning(false);
    setTimeLeft(3 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  

  return (
    
    <View style={styles.container}>
      <StatusBar />
      <Image source={
          require('./img/LogoNoirNoBG.png')} 
          style={{  width: 90,
                    height: 90,
                    resizeMode: 'contain',
                }}/>
      <View style={styles.inputView}>
      <View style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]}>
        <TextInput
          style={styles.input}
          value={squat}
          onChangeText={handleSquatChange}
          keyboardType='numeric'
        />
        <Text style={styles.text}>Squat</Text>
      </View>
      <View style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]}>
        <TextInput
          style={styles.input}
          value={bench}
          onChangeText={handleBenchChange}
          keyboardType='numeric'
        />
        <Text style={styles.text}>Bench</Text>
      </View>
      <View style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]}>
        <TextInput
          style={styles.input}
          value={deadlift}
          onChangeText={handleDeadliftChange}
          keyboardType='numeric'
        />
        <Text style={styles.text}>Deadlift</Text>
      </View>
      <View style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]}>
        <Text style={styles.text}>Total</Text>
        <Text style={styles.value}>{total ? total : '0 kg'}</Text>
      </View>
      </View>
      <View style={styles.timerContainerContainer}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Timer</Text>
        
        <Text style={styles.timerNumber}>{formattedTime}</Text>
      <View style={styles.timerLogoContainer}>
      <TouchableOpacity onPress={handlePlayPress} disabled={isRunning} style={styles.timerLogos}>
        <Entypo name="controller-play" size={50} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleStopPress} disabled={!isRunning} style={styles.timerLogos}>
        <Entypo name="controller-stop" size={50} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResetPress} style={styles.timerLogos}>
        <Entypo name="ccw" size={50} color="black" />
      </TouchableOpacity>
      </View>
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
  backgroundColor: 'white'
  },
  inputView:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    marginTop: 10
  },
  square: {
  shadowColor: 'black',
  shadowOffset: { 
    width: 0, 
    height: 11 },
  shadowOpacity: 0.16,
  shadowRadius: 16,
  elevation: 4,
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
  borderRadius: 5,
  
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
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
  },
  timerContainerContainer: {
    flex: 1,
    flexDirection: 'column'
    },
  timerText: {
  fontSize: 30,
  fontWeight: 'bold',
  },
  timerNumber: {
    fontSize: 50
  },
  timerLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerLogos: {
    margin: 10
  }
  });
export default HomeScreen;