import React, { 
  useState,
  useEffect
} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';


  import AsyncStorage from '@react-native-async-storage/async-storage';
  import 'react-native-get-random-values';
  import { v4 as uuidv4 } from 'uuid';
  import { LineChart } from 'react-native-chart-kit';
  
  import { MaterialIcons } from '@expo/vector-icons';

  import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


  import StatusBar from './MyStatusBar';

const Weight = () => {
  const [data3, setData3] = useState([]);
    const reversedData3 = data3.slice().reverse();
    const [showLineChart3, setShowLineChart3] = useState(false);

  
    useEffect(() => {
      AsyncStorage.getItem('data3').then(data3 => {
          if(data3){
            setData3(JSON.parse(data3));
            setShowLineChart3(true);
            
          }else{
            setData3([]);
          }
      });
    }, []);
  
    const [weight, setWeight] = useState('');
    const [total, setTotal] = useState(0);
    
    useEffect(() => {
      AsyncStorage.getItem('weight').then(value => {
          if(value){
            setWeight(value);
          }
      });
    }, []);
    
    useEffect(() => {
      AsyncStorage.setItem('weight', weight);
    }, [weight]);
  
    //part to save the input to don't put again the values
    const handleWeightChange = async (text) => {
      setWeight(text);
      await AsyncStorage.setItem('weight', text);
    }
    //end of the part of the save oif the inputfield
  
    const handleDelete = async (id) => {
      let updatedData3 = data3.filter(item => item.id !== id);
      setData3(updatedData3);
      await AsyncStorage.setItem('data3', JSON.stringify(updatedData3));
    }
  
  
    const weightInputRef = React.useRef(null);
  
    const handleWeightPress = () => {
      weightInputRef.current.focus();
    };

    const handleTotal = async () => {
  
      let date = new Date();
      let options = { day: 'numeric', month: 'numeric' };
      date = date.toLocaleDateString('fr-FR', options);
  
      const weightValue = parseFloat(weight) || 0;
      
      setTotal(weightValue);
  
      let newData3 = [...data3, { weight: weightValue, date, id: uuidv4() }];
      setData3(newData3);
  
  
      await AsyncStorage.setItem('data3', JSON.stringify(newData3));
    }

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
          <TouchableOpacity style={styles.square} onPress={handleWeightPress}>
            <TextInput
              ref={weightInputRef}
              style={styles.input}
              value={weight}
              onChangeText={handleWeightChange}
              keyboardType='numeric'
            />
            
            <Text style={styles.text}>Weight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.totalButton} onPress={() => {handleTotal(); setShowLineChart3(true);}}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <FlatList
          contentContainerStyle={{ alignItems: 'flex-end',}}
          style={styles.flatlist}
          data={reversedData3}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.weight} kg </Text>
              <Text style={styles.tableCell2}>{item.date}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          />
          {showLineChart3 && 
        <LineChart
          data={{
            labels: data3.map(item => item.date),
            datasets: [
              {
                data: data3.map(item => item.weight),
                strokeWidth: 2,
                label: 'Weight'
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
            decimalPlaces: 1,
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
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  
  squaresContainer: {
    flexDirection: 'column',
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
  },
  totalButton: {
    backgroundColor: '#e26a00',
    padding: 10,
    borderRadius: 5,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    marginTop: 10,
    width: '100%',
    
  },
  tableCell:{
    padding: 5,
    fontSize: 16,
    width: '50%',
    textAlign: 'center'
  },
  tableCell1: {
    textAlign: 'center',
    fontSize: 20,
    width: '20%'
  },
  tableCell2: {
    textAlign: 'center',
    fontSize: 16,
  },
  flatlist: {
    height: '20%',
    width: '80%',
    marginTop: -3,
  },
});

export default Weight;
