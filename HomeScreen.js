import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Entypo } from '@expo/vector-icons';

import { useWindowDimensions } from 'react-native';
import StatusBar from './MyStatusBar';

TouchableOpacity.defaultProps = { activeOpacity: 0.75 };
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
    AsyncStorage.getItem('squat').then(value => {
        if(value){
          setSquat(value);
        }
    });
    AsyncStorage.getItem('bench').then(value => {
        if(value){
          setBench(value);
        }
    });
    AsyncStorage.getItem('deadlift').then(value => {
        if(value){
          setDeadlift(value);
        }
    });
  }, []);


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

    
    const squatInputRef = React.useRef(null);
    const benchInputRef = React.useRef(null);
    const deadliftInputRef = React.useRef(null);
  
    const handleSquatPress = () => {
      squatInputRef.current.focus();
    };
    const handleBenchPress = () => {
      benchInputRef.current.focus();
    };
    const handleDeadliftPress = () => {
      deadliftInputRef.current.focus();
    };


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
      <TouchableOpacity style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]} onPress={handleSquatPress}>
      <Image source={
          require('./img/Squat.png')} 
          style={{  width: 120,
                    height: 120,
                    resizeMode: 'contain',
                }}/>
        <TextInput
          ref={squatInputRef}
          style={styles.input}
          value={ squat }
          onChangeText={handleSquatChange}
          keyboardType='numeric'
        />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]} onPress={handleBenchPress}>
      <Image source={
          require('./img/Bench.png')} 
          style={{  width: 120,
                    height: 120,
                    resizeMode: 'contain',
                }}/>
        <TextInput
          ref={benchInputRef}
          style={styles.input}
          value={ bench }
          onChangeText={handleBenchChange}
          keyboardType='numeric'
        />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]} onPress={handleDeadliftPress}>
      <Image source={
          require('./img/Deadlift.png')} 
          style={{  width: 120,
                    height: 120,
                    resizeMode: 'contain',
                }}/>
        <TextInput
          ref={deadliftInputRef}
          style={styles.input}
          value={ deadlift }
          onChangeText={handleDeadliftChange}
          keyboardType='numeric'
        />
      </TouchableOpacity>

      <View style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]}>
        <Text style={styles.text}>Total</Text>
        <Text style={styles.value}>{total ? total : '0'} kg</Text>
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
  marginBottom: 10,
  fontSize: 36,
  textAlign: 'center',
  fontWeight: 'bold',
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