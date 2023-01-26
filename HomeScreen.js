import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Entypo, Feather, AntDesign } from '@expo/vector-icons';

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
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(id);
            setIsRunning(false);
            handleResetPress()
          }
          return prevTime - 1
        });
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


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const toggleModal = () => {
      setIsModalVisible(!isModalVisible);
      };
    const toggleModal2 = () => {
        setIsModalVisible2(!isModalVisible2);
        };
    const toggleModal3 = () => {
          setIsModalVisible3(!isModalVisible3);
          };


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

      {isModalVisible && (
          <View style={styles.percentageStyle}>
          <View style={{ width: '50%', height: '60%' }}>
            <Text style={{fontSize: 19, fontWeight: 'bold', width: '150%', marginBottom: 8}}>Percentages</Text>
            {Array.from({length:11}, (_,i) => (i*5)+50).map(percentage => (
              <View key={percentage}>
                <Text>{percentage}% <Text>{(squat * percentage) / 100}</Text></Text>
                
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        )}

{isModalVisible2 && (
          <View style={styles.percentageStyle}>
          <View style={{ width: '50%', height: '60%' }}>
            <Text style={{fontSize: 19, fontWeight: 'bold', width: '150%', marginBottom: 8}}>Percentages</Text>
            {Array.from({length:11}, (_,i) => (i*5)+50).map(percentage => (
              <View key={percentage}>
                <Text>{percentage}% <Text>{(bench * percentage) / 100}</Text></Text>
                
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={toggleModal2} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        )}

{isModalVisible3 && (
          <View style={styles.percentageStyle}>
          <View style={{ width: '50%', height: '60%' }}>
            <Text style={{fontSize: 19, fontWeight: 'bold', width: '150%', marginBottom: 8}}>Percentages</Text>
            {Array.from({length:11}, (_,i) => (i*5)+50).map(percentage => (
              <View key={percentage}>
                <Text>{percentage}% <Text>{(deadlift * percentage) / 100}</Text></Text>
                
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={toggleModal3} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        )}
        
      <View style={styles.inputView}>
        
      <TouchableOpacity style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]} onPress={handleSquatPress}>
      
      <TouchableOpacity
        onPress={() => setIsModalVisible(!isModalVisible)}
        style={styles.percentageInSquare}>

          <Feather name="percent" size={24} color="black" />

      </TouchableOpacity>

      <Image source={
          require('./img/Squat.png')} 
          style={{  width: 120,
                    height: 120,
                    resizeMode: 'contain',
                }}/>

        <View style={styles.inputTextContainer}>
        <TextInput
          ref={squatInputRef}
          style={styles.input}
          value={ squat }
          onChangeText={handleSquatChange}
          keyboardType='numeric'
        />
        <Text style={styles.weightStyle}>kg</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]} onPress={handleBenchPress}>
      <TouchableOpacity
        onPress={() => setIsModalVisible2(!isModalVisible2)}
        style={styles.percentageInSquare}>

          <Feather name="percent" size={24} color="black" />

      </TouchableOpacity>
      <Image source={
          require('./img/Bench.png')} 
          style={{  width: 120,
                    height: 120,
                    resizeMode: 'contain',
                }}/>
        <View style={styles.inputTextContainer}>
          <TextInput
            ref={benchInputRef}
            style={styles.input}
            value={ bench }
            onChangeText={handleBenchChange}
            keyboardType='numeric'
          />
        <Text style={styles.weightStyle}>kg</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.square, { width: squareSize, height: squareSize, aspectRatio: 1 }]} onPress={handleDeadliftPress}>
      <TouchableOpacity
        onPress={() => setIsModalVisible3(!isModalVisible3)}
        style={styles.percentageInSquare}>

          <Feather name="percent" size={24} color="black" />

      </TouchableOpacity>
      <Image source={
          require('./img/Deadlift.png')} 
          style={{  width: 120,
                    height: 120,
                    resizeMode: 'contain',
                }}/>
        <View style={styles.inputTextContainer}>
          <TextInput
            ref={deadliftInputRef}
            style={styles.input}
            value={ deadlift }
            onChangeText={handleDeadliftChange}
            keyboardType='numeric'
          />
        <Text style={styles.weightStyle}>kg</Text>
        </View>
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
  },
  inputTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  percentageInSquare:{
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    zIndex: 2
  },
  percentageStyle:{
    position: 'absolute', 
    flexDirection: 'row', 
    zIndex: 3, 
    backgroundColor: 'white',
    padding: 15,
    shadowColor: 'black', 
    shadowOffset: { 
      width: 0, 
      height: 11 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 20,
    borderRadius: 5,
    top: '20%',
    right: '4%',
  },
  closeButton:{
    position: 'absolute',
    right: 0,
    top: -40,
    borderRadius: 45,
    shadowColor: 'black', 
    width: 40,
    height: 40,
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
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
  width: '50%',
  height: 40,
  marginBottom: 10,
  fontSize: 36,
  textAlign: 'center',
  fontWeight: 'bold',
  },
  weightStyle:{
    fontSize: 25,
    textAlign: 'center',
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
  marginTop: '1%',
  
  },
  timerContainerContainer: {
    flex: 1,
    flexDirection: 'column',
    },
  timerText: {
    fontSize: 40,
    textAlign: 'center',
    color: 'black',
  },
  timerNumber: {
    fontSize: 50,
  },
  timerLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    margin: '2%',
    borderRadius: 46,
  },
  timerLogos: {
    margin: 10
  }
  });
export default HomeScreen;