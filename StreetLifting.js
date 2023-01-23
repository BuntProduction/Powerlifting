import React, { 
    useState,
    useEffect
  } from 'react';
  import { 
    View, Text, StyleSheet, TouchableOpacity, TextInput , FlatList, Dimensions, Image, Pressable
  } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import 'react-native-get-random-values';
  import { v4 as uuidv4 } from 'uuid';
  
  import { LineChart } from 'react-native-chart-kit';

  import StatusBar from './MyStatusBar';

  import { MaterialIcons, Entypo } from '@expo/vector-icons';
  
  
  //For example, you can pass down the data, squat, bench, deadlift, and handleTotal functions from the App component as props to the InputForm component, and use them within the InputForm component to update the AsyncStorage and the state of the App component.
  
  const StreetLifting = () => {
  
  
    const [data2, setData2] = useState([]);
    const reversedData2 = data2.slice().reverse();
    const [showLineChart2, setShowLineChart2] = useState(false);
  
  
    useEffect(() => {
      AsyncStorage.getItem('data2').then(data2 => {
          if(data2){
            setData2(JSON.parse(data2));
            setShowLineChart2(true);
          }else{
            setData2([]);
          }
      });
    }, []);
  
    const [dips, setDips] = useState('');
    const [traction, setTraction] = useState('');
    const [muscleup, setMuscleup] = useState('');
    const [total, setTotal] = useState(0);
    
    useEffect(() => {
      AsyncStorage.getItem('dips').then(value => {
          if(value){
            setDips(value);
          }
      });
      AsyncStorage.getItem('traction').then(value => {
          if(value){
            setTraction(value);
          }
      });
      AsyncStorage.getItem('muscleup').then(value => {
          if(value){
            setMuscleup(value);
          }
      });
    }, []);
    
    useEffect(() => {
      AsyncStorage.setItem('dips', dips);
      AsyncStorage.setItem('traction', traction);
      AsyncStorage.setItem('muscleup', muscleup);
    }, [dips, traction, muscleup]);
  
    //part to save the input to don't put again the values
    const handleDipsChange = async (text) => {
      setDips(text);
      await AsyncStorage.setItem('dips', text);
    }
  
    const handleTractionChange = async (text) => {
      setTraction(text);
      await AsyncStorage.setItem('traction', text);
    }
  
    const handleMuscleupChange = async (text) => {
      setMuscleup(text);
      await AsyncStorage.setItem('muscle', text);
    }
    //end of the part of the save oif the inputfield
  
    const handleTotal = async () => {
  
      let date = new Date();
      let options = { day: 'numeric', month: 'numeric' };
      date = date.toLocaleDateString('fr-FR', options);
  
      const dipsValue = parseInt(dips) || 0;
      const tractionValue = parseInt(traction) || 0;
      const muscleupValue = parseInt(muscleup) || 0;
      
      const newTotal = dipsValue + tractionValue + muscleupValue;
      setTotal(newTotal);
  
      let newData2 = [...data2, { dips: dipsValue, traction: tractionValue, muscleup: muscleupValue, total: newTotal, date, id: uuidv4() }];
      setData2(newData2);
  
  
      await AsyncStorage.setItem('data2', JSON.stringify(newData2));
    }
    
  
    const handleDelete = async (id) => {
      let updatedData2 = data2.filter(item => item.id !== id);
      setData2(updatedData2);
      await AsyncStorage.setItem('data2', JSON.stringify(updatedData2));
    }
  
  
    const dipsInputRef = React.useRef(null);
    const tractionInputRef = React.useRef(null);
    const muscleupInputRef = React.useRef(null);
  
    const handleDipsPress = () => {
      dipsInputRef.current.focus();
    };
    const handleTractionPress = () => {
      tractionInputRef.current.focus();
    };
    const handleMuscleupPress = () => {
      muscleupInputRef.current.focus();
    };

    useEffect(() => {
      const newTotal = parseInt(dips) + parseInt(traction) + parseInt(muscleup);
      setTotal(newTotal);
    }, [dips, traction, muscleup]);
  
    
    return (
  
      
      <View style={styles.container}>
        
        <Image source={
          require('./img/SBDPerf4.png')} 
          style={{  width: 140,
            height: 140,
            resizeMode: 'contain',
            marginTop: -30
                }}/>
        
        <View style={styles.squaresContainer}>
          <TouchableOpacity style={styles.square} onPress={handleDipsPress}>
            <TextInput
              ref={dipsInputRef}
              style={styles.input}
              value={dips}
              onChangeText={handleDipsChange}
              keyboardType='numeric'
            />
            <Text style={styles.text}>Dips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.square} onPress={handleTractionPress}>
            <TextInput
              ref={tractionInputRef}
              style={styles.input}
              onChangeText={handleTractionChange}
              value={traction}
              keyboardType='numeric'
            />
            <Text style={styles.text}>Traction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.square} onPress={handleMuscleupPress}>
            <TextInput
              ref={muscleupInputRef}
              style={styles.input}
              onChangeText={handleMuscleupChange}
              value={muscleup}
              keyboardType='numeric'
            />
            <Text style={styles.text}>Muscleup</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalValue}>{total ? total : '0'} kg</Text>
            <TouchableOpacity style={styles.totalButton} onPress={handleTotal}>
              <Entypo name="save" size={30} color="#97A4B3"/>
            </TouchableOpacity>
          </View>
          <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Dips</Text>
              <Text style={styles.tableCell}>Traction</Text>
              <Text style={styles.tableCell3}>Muscleup</Text>
              <Text style={styles.tableCell}>Total</Text>
              <Text style={styles.tableCell}>Date</Text>
              <Text style={styles.tableCell2}>                   </Text>
            </View>
        <FlatList
          contentContainerStyle={{ alignItems: 'flex-end',}}
          style={styles.flatlist}
          data={reversedData2}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow2}>
              <Text style={styles.tableCell}>{item.dips} kg </Text>
              <Text style={styles.tableCell}>{item.traction} kg </Text>
              <Text style={styles.tableCell}>{item.muscleup} kg </Text>
              <Text style={styles.tableCell1}>{item.total} kg</Text>
              <Text style={styles.tableCell2}>{item.date}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="#97A4B3" />
              </TouchableOpacity>
            </View>
          )}
        />
        <View>
  
          {showLineChart2 && 
        <LineChart
          data={{
            labels: data2.map(item => item.date),
            datasets: [
              {
                data: data2.map(item => item.dips),
                strokeWidth: 2,
                label: 'Dips'
              },
              {
                data: data2.map(item => item.traction),
                strokeWidth: 2,
                label: 'Traction'
              },
              {
                data: data2.map(item => item.muscleup),
                strokeWidth: 2,
                label: 'Muscleup'
              },
              {
                data: data2.map(item => item.total),
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
      backgroundColor: 'white'
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
      marginRight: 10,
      marginLeft: 10,
      fontSize: 25,
      textAlign: 'center',
      fontWeight: 'bold',
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
    deleteButton: {
  
    },
    buttonDelete: {
      color: 'red',
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      width: '100%',
      elevation: 4,
      shadowColor: 'rgba(0, 0, 0, 0.7)',
      shadowOffset: { width: 0, height: 11 },
      shadowOpacity: 1,
      shadowRadius: 16,
      backgroundColor: 'white',
      
    },
    tableRow2: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      width: '100%',
      elevation: 4,
      shadowColor: 'rgba(0, 0, 0, 0.7)',
      shadowOffset: { width: 0, height: 11 },
      shadowOpacity: 1,
      shadowRadius: 16,
      backgroundColor: 'white',
      marginRight: '2%'
    },
    tableCell:{
      marginLeft: -4,
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
      fontSize: 16
    },
    
    tableCell3:{
      padding: 5,
      fontSize: 16,
      textAlign: 'center',
      
      fontWeight: 'bold',
    },
    flatlist: {
      width: '100%',
      marginTop: 5, 
    },
  });
  
  export default StreetLifting;
  