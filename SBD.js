import React, { 
    useState,
    useEffect
  } from 'react';
  import { 
    View, Text, StyleSheet, TouchableOpacity, TextInput , FlatList, Dimensions, Image, Pressable, Modal, BackHandler
  } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import 'react-native-get-random-values';
  import { v4 as uuidv4 } from 'uuid';
  
  import { LineChart } from 'react-native-chart-kit';

  import { MaterialIcons, Entypo, FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

  import StatusBar from './MyStatusBar';
  import { ScrollView } from 'react-native-gesture-handler';
  import { useNavigation } from '@react-navigation/native';

  
  
  //For example, you can pass down the data, squat, bench, deadlift, and handleTotal functions from the App component as props to the InputForm component, and use them within the InputForm component to update the AsyncStorage and the state of the App component.
  
  const SBD = () => {
  
    const [data, setData] = useState([]);
    const reversedData = data.slice().reverse();
    const [showLineChart, setShowLineChart] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

  
    useEffect(() => {
      AsyncStorage.getItem('data').then(data => {
          if(data && data.length > 0){
              setData(JSON.parse(data));
              setShowLineChart(true);
          }else{
              setData([]);
              setShowLineChart(false);
          }
      });
  }, []);
  
    const [squat, setSquat] = useState('');
    const [bench, setBench] = useState('');
    const [deadlift, setDeadlift] = useState('');
    const [total, setTotal] = useState(0);
    
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
      AsyncStorage.setItem('squat', squat);
      AsyncStorage.setItem('bench', bench);
      AsyncStorage.setItem('deadlift', deadlift);
    }, [squat, bench, deadlift]);
  
    //part to save the input to don't put again the values
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
    //end of the part of the save oif the inputfield

    const [isSaved, setIsSaved] = useState(false);
  
    const handleTotal = async () => {
  
      let date = new Date();
      let options = { day: 'numeric', month: 'numeric' };
      date = date.toLocaleDateString('fr-FR', options);
  
      const squatValue = parseInt(squat) || 0;
      const benchValue = parseInt(bench) || 0;
      const deadliftValue = parseInt(deadlift) || 0;
      
      const newTotal = squatValue + benchValue + deadliftValue;
      setTotal(newTotal);
  
      let newData = [...data, { squat: squatValue, bench: benchValue, deadlift: deadliftValue, total: newTotal, date, id: uuidv4() }];
      setData(newData);

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
       }, 2000);
  
  
      await AsyncStorage.setItem('data', JSON.stringify(newData));
    }
    
  
    const handleDelete = async (id) => {
      let updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      await AsyncStorage.setItem('data', JSON.stringify(updatedData));
    }
  
  
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

//for the max of each values
    const extractMaxValues = () => {
      let maxValues = {};
      data.forEach(item => {
          if(!maxValues.squat || item.squat > maxValues.squat) {
              maxValues.squat = item.squat;
          }
          if(!maxValues.bench || item.bench > maxValues.bench) {
              maxValues.bench = item.bench;
          }
          if(!maxValues.deadlift || item.deadlift > maxValues.deadlift) {
              maxValues.deadlift = item.deadlift;
          }
          if(!maxValues.total || item.total > maxValues.total) {
            maxValues.total = item.total;
        }
      });
      return maxValues;
  }

  const maxValues = extractMaxValues(data);


  useEffect(() => {
    const newTotal = parseInt(squat) + parseInt(bench) + parseInt(deadlift);
    setTotal(newTotal);
  }, [squat, bench, deadlift]); // to addition the data before the save button
  
  let filteredData = data;
  if (data.length > 9) {
      filteredData = data.slice(data.length-9); //limit to 9 values in the graph
  }

//for the inputs in the modal
  const [inputValueSquat, setInputValueSquat] = useState(0);
  const [inputValueBench, setInputValueBench] = useState(0);
  const [inputValueDeadlift, setInputValueDeadlift] = useState(0);


  const handleSquatChange2 = async (text) => {
    setInputValueSquat(text);
    await AsyncStorage.setItem('inputValueSquat', text);
  }

  const handleBenchChange2 = async (text) => {
    setInputValueBench(text);
    await AsyncStorage.setItem('inputValueBench', text);
  }

  const handleDeadliftChange2 = async (text) => {
    setInputValueDeadlift(text);
    await AsyncStorage.setItem('inputValueDeadlift', text);
  }

  useEffect(() => {
    AsyncStorage.getItem('inputValueSquat').then(value => {
        if(value){
          setInputValueSquat(value);
        }
    });
    AsyncStorage.getItem('inputValueBench').then(value => {
        if(value){
          setInputValueBench(value);
        }
    });
    AsyncStorage.getItem('inputValueDeadlift').then(value => {
        if(value){
          setInputValueDeadlift(value);
        }
    });
  }, []);


  // Back button part

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => backHandler.remove();
  }, []);

  function handleBackPress() {
    setModalVisible(false);
    return true;
  }



  //end of back button part

  //image part////////////////////////////////////////////////////////////////////////////////
  const mapMaxSquatToOpacity = (maxSquat) => {
    if (maxSquat >= 50) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightBronze = (props) => {
    const opacity = mapMaxSquatToOpacity(props.maxSquat);
  
    return (
      <Image
        source={require('./img/medals/weightBronze.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxSquatToOpacity2 = (maxSquat) => {
    if (maxSquat >= 100) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightSilver = (props) => {
    const opacity = mapMaxSquatToOpacity2(props.maxSquat);
  
    return (
      <Image
        source={require('./img/medals/weightSilver.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxSquatToOpacity3 = (maxSquat) => {
    if (maxSquat >= 150) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightGold = (props) => {
    const opacity = mapMaxSquatToOpacity3(props.maxSquat);
  
    return (
      <Image
        source={require('./img/medals/weightGold.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxSquatToOpacity4 = (maxSquat) => {
    if (maxSquat >= 200) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightSaphire = (props) => {
    const opacity = mapMaxSquatToOpacity4(props.maxSquat);
  
    return (
      <Image
        source={require('./img/medals/weightSaphire.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxSquatToOpacity5 = (maxSquat) => {
    if (maxSquat >= 225) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightRuby = (props) => {
    const opacity = mapMaxSquatToOpacity5(props.maxSquat);
  
    return (
      <Image
        source={require('./img/medals/weightRuby.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxSquatToOpacity6 = (maxSquat) => {
    if (maxSquat >= 250) {
      return 1;
    } else {
      return 0.12;
    }
  }
  
  const WeightBlack = (props) => {
    const opacity = mapMaxSquatToOpacity6(props.maxSquat);
  
    return (
      <Image
        source={require('./img/medals/weightBlack.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }

  const mapMaxBenchToOpacity = (maxBench) => {
    if (maxBench >= 50) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightBronzeBench = (props) => {
    const opacity = mapMaxBenchToOpacity(props.maxBench);
  
    return (
      <Image
        source={require('./img/medals/weightBronzeBench.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxBenchToOpacity2 = (maxBench) => {
    if (maxBench >= 80) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightSilverBench = (props) => {
    const opacity = mapMaxBenchToOpacity2(props.maxBench);
  
    return (
      <Image
        source={require('./img/medals/weightSilverBench.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxBenchToOpacity3 = (maxBench) => {
    if (maxBench >= 100) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightGoldBench = (props) => {
    const opacity = mapMaxBenchToOpacity3(props.maxBench);
  
    return (
      <Image
        source={require('./img/medals/weightGoldBench.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxBenchToOpacity4 = (maxBench) => {
    if (maxBench >= 130) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightSaphireBench = (props) => {
    const opacity = mapMaxBenchToOpacity4(props.maxBench);
  
    return (
      <Image
        source={require('./img/medals/weightSaphireBench.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxBenchToOpacity5 = (maxBench) => {
    if (maxBench >= 150) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightRubyBench = (props) => {
    const opacity = mapMaxBenchToOpacity5(props.maxBench);
  
    return (
      <Image
        source={require('./img/medals/weightRubyBench.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxBenchToOpacity6 = (maxBench) => {
    if (maxBench >= 180) {
      return 1;
    } else {
      return 0.12;
    }
  }
  
  const WeightBlackBench = (props) => {
    const opacity = mapMaxBenchToOpacity6(props.maxBench);
  
    return (
      <Image
        source={require('./img/medals/weightBlackBench.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }

  const mapMaxDeadliftToOpacity = (maxDeadlift) => {
    if (maxDeadlift >= 50) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightBronzeDeadlift = (props) => {
    const opacity = mapMaxDeadliftToOpacity(props.maxDeadlift);
  
    return (
      <Image
        source={require('./img/medals/weightBronzeDeadlift.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxDeadliftToOpacity2 = (maxDeadlift) => {
    if (maxDeadlift >= 100) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightSilverDeadlift = (props) => {
    const opacity = mapMaxDeadliftToOpacity2(props.maxDeadlift);
  
    return (
      <Image
        source={require('./img/medals/weightSilverDeadlift.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxDeadliftToOpacity3 = (maxDeadlift) => {
    if (maxDeadlift >= 150) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightGoldDeadlift = (props) => {
    const opacity = mapMaxDeadliftToOpacity3(props.maxDeadlift);
  
    return (
      <Image
        source={require('./img/medals/weightGoldDeadlift.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxDeadliftToOpacity4 = (maxDeadlift) => {
    if (maxDeadlift >= 200) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightSaphireDeadlift = (props) => {
    const opacity = mapMaxDeadliftToOpacity4(props.maxDeadlift);
  
    return (
      <Image
        source={require('./img/medals/weightSaphireDeadlift.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxDeadliftToOpacity5 = (maxDeadlift) => {
    if (maxDeadlift >= 250) {
      return 1;
    } else {
      return 0.15;
    }
  }
  
  const WeightRubyDeadlift = (props) => {
    const opacity = mapMaxDeadliftToOpacity5(props.maxDeadlift);
  
    return (
      <Image
        source={require('./img/medals/weightRubyDeadlift.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  const mapMaxDeadliftToOpacity6 = (maxDeadlift) => {
    if (maxDeadlift >= 300) {
      return 1;
    } else {
      return 0.12;
    }
  }
  
  const WeightBlackDeadlift = (props) => {
    const opacity = mapMaxDeadliftToOpacity6(props.maxDeadlift);
  
    return (
      <Image
        source={require('./img/medals/weightBlackDeadlift.png')}
        style={{ 
          width: 90,
          height: 90,
          resizeMode: 'contain',
          opacity: opacity }}
      />
    );
  }
  //end of image part////////////////////////////////////////////////////////////////////////////////
  
  //part to focus the input with the loading bar
  const loadingBar1 = React.useRef(null);
  const loadingBar2 = React.useRef(null);
  const loadingBar3 = React.useRef(null);

  const handleLoadingBar1 = () => {
    loadingBar1.current.focus();
  };
  const handleLoadingBar2 = () => {
    loadingBar2.current.focus();
  };
  const handleLoadingBar3 = () => {
    loadingBar3.current.focus();
  };
  //end of the focus part

    return (
  
      
      <View style={styles.container}>
        
        <Image source={
          require('./img/SBDPerf4.png')} 
          style={{  width: 140,
            height: 140,
            resizeMode: 'contain',
            marginTop: '-10%'
                }}/>
        <TouchableOpacity style={styles.trophyButton} onPress={() => setModalVisible(true)}>
          <FontAwesome5 name='trophy' size={24} color={'#97A4B3'} />
        </TouchableOpacity>

          <Modal visible={modalVisible}>
            <ScrollView>
              <View style={styles.modalOverlay}>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backButton}>
                    <AntDesign name="back" size={32} color="#97A4B3" />
                  </TouchableOpacity>
                  <View style={styles.goalsContainer}>
                      <Text style={styles.titleModal}>Goals</Text>

                  <TouchableOpacity onPress={handleLoadingBar1}>  
                  <View style={styles.goalsTextContainer}>
                  
                    <Text style={styles.textGoal3}>Max Squat : {maxValues.squat}</Text>
                    <Text style={styles.textGoal}>Goal : </Text>
                    <TextInput
                    ref={loadingBar1}
                      defaultValue={'0'}
                      value={inputValueSquat}
                      onChangeText={(text) => {
                        if (text.length <= 3) {
                            handleSquatChange2(text);
                        }
                    }}
                      keyboardType='numeric'
                      onFocus={() => {
                        if (inputValueSquat === '0') {
                          setInputValueSquat('');
                        }
                      }}
                    />
                  </View>
                  <View style={styles.progressBarContainer}>
                  <View
                    style={{
                      width: `${(inputValueSquat < maxValues.squat ? inputValueSquat : maxValues.squat) / inputValueSquat * 100}%`,
                      height: 10,
                      backgroundColor: '#fca11c',
                      borderRadius: 10
                    }}
                  />
                  
                  </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleLoadingBar2}>

                  <View style={styles.goalsTextContainer}>
                    <Text style={styles.textGoal3}>Max Bench : {maxValues.bench}</Text>
                    <Text style={styles.textGoal}>Goal : </Text>
                    <TextInput
                      ref={loadingBar2}
                      defaultValue={'0'}
                      value={inputValueBench}
                      onChangeText={(text) => {
                        if (text.length <= 3) {
                            handleBenchChange2(text);
                        }
                    }}
                      onFocus={() => {
                        if (inputValueBench === '0') {
                          setInputValueBench('');
                        }
                      }}
                      keyboardType='numeric'
                    />
                  </View>
                  <View style={styles.progressBarContainer}>
                  
                  <View
                    style={{
                      width: `${( maxValues.bench / inputValueBench ) * 100}%`,
                      height: 10,
                      backgroundColor: '#fca11c',
                      borderRadius: 10
                    }}
                  />
                  </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleLoadingBar3}>

                  <View style={styles.goalsTextContainer}>
                    <Text style={styles.textGoal3}>Max Deadlift : {maxValues.deadlift}</Text>
                    <Text style={styles.textGoal2}>Goal : </Text>
                    <TextInput
                      ref={loadingBar3}
                      defaultValue={'0'}
                      value={inputValueDeadlift}
                      onChangeText={(text) => {
                        if (text.length <= 3) {
                          handleDeadliftChange2(text);
                        }
                    }}
                      keyboardType='numeric'
                      onFocus={() => {
                        if (inputValueDeadlift === '0') {
                          setInputValueDeadlift('');
                        }
                      }}
                    />
                  </View>
                  </TouchableOpacity>

                  <View style={styles.progressBarContainer}>
                  <View
                    style={{
                      width: `${( maxValues.deadlift / inputValueDeadlift ) * 100}%`,
                      height: 10,
                      backgroundColor: '#fca11c',
                      borderRadius: 10,
                    }}
                  />
                  </View>
                  </View>
                  <Text style={styles.titleModal2}>Achievements</Text>
                  <Text style={{textAlign: 'center', fontStyle: 'italic', marginBottom: 25}}>Improve your scores and unlock all the medals !</Text>
                  
                  <Text style={styles.titleCategories}>Squat</Text>
                  <View style={styles.medals}>
                    <View  style={styles.medalBox}>
                      <WeightBronze maxSquat={maxValues.squat}/>
                      <Text style={styles.medalText}>Squat 50kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightSilver maxSquat={maxValues.squat}/>
                      <Text style={styles.medalText}>Squat 100kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightGold maxSquat={maxValues.squat}/>
                      <Text style={styles.medalText}>Squat 150kg</Text>
                    </View>
                  </View>
                  <View style={styles.medals}>
                    <View  style={styles.medalBox}>
                    <WeightSaphire maxSquat={maxValues.squat}/>
                      <Text style={styles.medalText}>Squat 200kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightRuby maxSquat={maxValues.squat}/>
                      <Text style={styles.medalText}>Squat 225kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightBlack maxSquat={maxValues.squat}/>
                      <Text style={styles.medalText}>Squat 250kg</Text>
                    </View>
                  </View>
                  <Text style={styles.titleCategories}>Bench</Text>
                  <View style={styles.medals}>
                    <View  style={styles.medalBox}>
                    <WeightBronzeBench maxBench={maxValues.bench}/>
                      <Text style={styles.medalText}>Bench 50kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightSilverBench maxBench={maxValues.bench}/>
                      <Text style={styles.medalText}>Bench 80kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightGoldBench maxBench={maxValues.bench}/>
                      <Text style={styles.medalText}>Bench 100kg</Text>
                    </View>
                  </View>
                  <View style={styles.medals}>
                    <View  style={styles.medalBox}>
                    <WeightSaphireBench maxBench={maxValues.bench}/>
                      <Text style={styles.medalText}>Bench 130kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightRubyBench maxBench={maxValues.bench}/>
                      <Text style={styles.medalText}>Bench 150kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightBlackBench maxBench={maxValues.bench}/>
                      <Text style={styles.medalText}>Bench 180kg</Text>
                    </View>
                  </View>
                  <Text style={styles.titleCategories}>Deadlift</Text>
                  <View style={styles.medals}>
                    <View  style={styles.medalBox}>
                    <WeightBronzeDeadlift maxDeadlift={maxValues.deadlift}/>
                      <Text style={styles.medalText}>Deadlift 50kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightSilverDeadlift maxDeadlift={maxValues.deadlift}/>
                      <Text style={styles.medalText}>Deadlift 100kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightGoldDeadlift maxDeadlift={maxValues.deadlift}/>
                      <Text style={styles.medalText}>Deadlift 150kg</Text>
                    </View>
                  </View>
                  <View style={styles.medals}>
                    <View  style={styles.medalBox}>
                    <WeightSaphireDeadlift maxDeadlift={maxValues.deadlift}/>
                      <Text style={styles.medalText}>Deadlift 200kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightRubyDeadlift maxDeadlift={maxValues.deadlift}/>
                      <Text style={styles.medalText}>Deadlift 250kg</Text>
                    </View>
                    <View  style={styles.medalBox}>
                    <WeightBlackDeadlift maxDeadlift={maxValues.deadlift}/>
                      <Text style={styles.medalText}>Deadlift 300kg</Text>
                    </View>
                  </View>
              </View>
              <View style={styles.spaceUnder}></View>
              </ScrollView>
          </Modal>

        <View style={styles.squaresContainer}>
          <TouchableOpacity style={styles.square} onPress={handleSquatPress}>
            <TextInput
              ref={squatInputRef}
              style={styles.input}
              value={squat}
              onChangeText={handleSquatChange}
              keyboardType='numeric'
            />
            <Text style={styles.text}>Squat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.square} onPress={handleBenchPress}>
            <TextInput
              ref={benchInputRef}
              style={styles.input}
              onChangeText={handleBenchChange}
              value={bench}
              keyboardType='numeric'
            />
            <Text style={styles.text}>Bench</Text>
            
          </TouchableOpacity>
          <TouchableOpacity style={styles.square} onPress={handleDeadliftPress}>
            <TextInput
              ref={deadliftInputRef}
              style={styles.input}
              onChangeText={handleDeadliftChange}
              value={deadlift}
              keyboardType='numeric'
            />
            <Text style={styles.text}>Deadlift</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalValue}>{total ? total : '0'} kg</Text>
            
            <TouchableOpacity style={styles.totalButton} onPress={() => {handleTotal(); setShowLineChart(true);}}>
              <Entypo name="save" size={30} color="#97A4B3"/>
            </TouchableOpacity>
            {isSaved && (
              <View style={styles.savedContainer}>
                <Text style={styles.savedText}>Saved</Text>
              </View>
            )}
          </View>
          <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Squat</Text>
              <Text style={styles.tableCell}>Bench</Text>
              <Text style={styles.tableCell}>Deadlift</Text>
              <Text style={styles.tableCell}>Total</Text>
              <Text style={styles.tableCell}>Date</Text>
              <Text style={styles.tableCell2}>                   </Text>
            </View>
        <FlatList
          contentContainerStyle={{ alignItems: 'flex-end',}}
          style={styles.flatlist}
          data={reversedData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow2}>
              <Text style={styles.tableCell}>{item.squat} kg </Text>
              <Text style={styles.tableCell}>{item.bench} kg </Text>
              <Text style={styles.tableCell}>{item.deadlift} kg </Text>
              <Text style={styles.tableCell1}>{item.total} kg</Text>
              <Text style={styles.tableCell2}>{item.date}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="#97A4B3" />
              </TouchableOpacity>
            </View>
          )}
        />
        <View>
  
          {showLineChart && 
        <LineChart
          data={{
            labels: filteredData.map(item => item.date.slice(0, -3)),
            datasets: [
              {
                data: filteredData.map(item => item.squat),
                strokeWidth: 2,
                label: 'Squat'
              },
              {
                data: filteredData.map(item => item.bench),
                strokeWidth: 2,
                label: 'Bench'
              },
              {
                data: filteredData.map(item => item.deadlift),
                strokeWidth: 2,
                label: 'Deadlift'
              },
              {
                data: filteredData.map(item => item.total),
                strokeWidth: 2,
                label: 'Total'
              },
            ],
          }}
          width={Dimensions.get("window").width - 12}
          height={220}
          yAxisLabel={'kg '}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#97A4B3",
            backgroundGradientTo: "#bec6cf",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
              
            },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            marginBottom: '25%',
            borderRadius: 10,
          }}
        />}
        </View>
  
      </View>
      
    );
  };
  
  // STYLE PART ///////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    trophyButton:{
      position: 'absolute',
      top: '11%',
      right: '5%',
    },
    goalsContainer:{
    },
    goalsTextContainer:{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 5,
      marginTop: 5
    },
    backButton:{
      width: 45,
      height: 45,
      left: '3%',
      top: '0.5%',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 45,
      padding: 5,
      elevation: 4,
      backgroundColor: 'white'
    },
    titleModal:{
      justifyContent: 'center',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 30,
      marginBottom: 30,
      marginTop: -5
    },
    titleModal2:{
      justifyContent: 'center',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 30,
      marginBottom: 30,
      marginTop: 30
    },
    progressBarContainer:{
      marginLeft: '10%',
      width: '80%',
      backgroundColor: '#97A4B3',
      height: 10,
      borderRadius: 10,

    },
    textGoal:{
      marginLeft: '30%',
      fontWeight: 'bold'

    },
    
    textGoal2:{
      marginLeft: '26%',
      fontWeight: 'bold'

    },
    textGoal3:{
      fontWeight: 'bold'
    },
    modalOverlay:{
      width: '100%',
    },
    medals:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      

    },
    medalBox:{
      shadowColor: 'black',
      shadowOffset: { 
        width: 0, 
        height: 11 },
      shadowOpacity: 0.16,
     shadowRadius: 16,
      elevation: 4,
      width: '30%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      margin: 5,
      borderRadius: 5,
      activeOpacity: 1,
      marginBottom: '3%'
    },
    medalText:{
      fontWeight: 'bold'
    },
    titleCategories:{
      margin: '5%',
      fontSize: 23,
      fontWeight: 'bold'
    },
    spaceUnder:{
      marginBottom: 50
    },
    
    squaresContainer: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 15,
      
    },
    square: {
      shadowColor: 'black',
      shadowOffset: { 
        width: 0, 
        height: 11 },
      shadowOpacity: 0.16,
     shadowRadius: 16,
      elevation: 4,
      width: '30%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      margin: 5,
      borderRadius: 5,
      activeOpacity: 1
    },
    input: {
      height: 40,
      width: '80%',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    value: {
      fontSize: 16,
      textAlign: 'center',
      color: '#fca11c'
    },
    totalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    totalText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    totalValue: {
      fontWeight: 'bold',
      marginRight: 10,
      marginLeft: 10,
      fontSize: 25,
      textAlign: 'center',
      color: '#fca11c'

    },
    totalButton: {
      marginTop: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    savedContainer:{
      marginLeft: 10,

    },

    savedText: {
      fontStyle:'italic',
      fontSize: 15,
    },

    buttonDelete: {
      color: 'black',
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'white',
      padding: 10,
      marginTop: '2%',
      width: '100%',
      elevation: 4,
      shadowColor: 'rgba(0, 0, 0, 0.7)',
      shadowOffset: { width: 0, height: 11 },
      shadowOpacity: 1,
      shadowRadius: 16,
      backgroundColor: 'white'
      
    },
    tableRow2:{
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      width: '95%',
      elevation: 4,
      shadowColor: 'rgba(0, 0, 0, 0.7)',
      shadowOffset: { width: 0, height: 11 },
      shadowOpacity: 1,
      shadowRadius: 16,
      backgroundColor: 'white',
      marginRight: 10
    },
    tableCell:{
      padding: 1,
      fontSize: 16,
      width: '18%',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    tableCell1: {
      textAlign: 'center',
      fontSize: 20,
      width: '20%',
      fontWeight: 'bold',
    },
    tableCell2: {
      textAlign: 'center',
      fontSize: 16,
    },
    flatlist: {
      width: '100%',
      marginTop: 5, 

    },
  });
  
  export default SBD;
  