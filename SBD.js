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

  import { MaterialIcons, Entypo } from '@expo/vector-icons';

  import StatusBar from './MyStatusBar';
  
  
  
  //For example, you can pass down the data, squat, bench, deadlift, and handleTotal functions from the App component as props to the InputForm component, and use them within the InputForm component to update the AsyncStorage and the state of the App component.
  
  const SBD = () => {
  
    const [data, setData] = useState([]);
    const reversedData = data.slice().reverse();
    const [showLineChart, setShowLineChart] = useState(false);

  
    useEffect(() => {
      AsyncStorage.getItem('data').then(data => {
          if(data){
            setData(JSON.parse(data));
            setShowLineChart(true);
            
          }else{
            setData([]);
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
      });
      return maxValues;
  }

  useEffect(() => {
    const newTotal = parseInt(squat) + parseInt(bench) + parseInt(deadlift);
    setTotal(newTotal);
  }, [squat, bench, deadlift]); // to addition the data before the save button
  
  let filteredData = data;
  filteredData = filteredData.slice(data.length-10); // limit to 10 values
    
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
            labels: filteredData.map(item => item.date),
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
      marginTop: 10,
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
  