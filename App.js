import React, { 
  useState,
  useEffect
} from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput , FlatList, Dimensions, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { LineChart } from 'react-native-chart-kit';

const App = () => {

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


  return (
    <View style={styles.container}>
      <Image source={
        require('./img/sbdlogo.png')} 
        style={{  width: 100,
                  height: 100,
                  resizeMode: 'contain',
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
          <Text style={styles.value}>{squat}</Text>
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
          <Text style={styles.value}>{bench}</Text>
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
          <Text style={styles.value}>{deadlift}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalValue}>{total} kg</Text>
          <TouchableOpacity style={styles.totalButton} onPress={handleTotal}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
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
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.squat} kg </Text>
            <Text style={styles.tableCell}>{item.bench} kg </Text>
            <Text style={styles.tableCell}>{item.deadlift} kg </Text>
            <Text style={styles.tableCell1}>{item.total} kg</Text>
            <Text style={styles.tableCell2}>{item.date}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View>

        {showLineChart && 
      <LineChart
        data={{
          labels: data.map(item => item.date),
          datasets: [
            {
              data: data.map(item => item.squat),
              strokeWidth: 2,
              label: 'Squat'
            },
            {
              data: data.map(item => item.bench),
              strokeWidth: 2,
              label: 'Bench'
            },
            {
              data: data.map(item => item.deadlift),
              strokeWidth: 2,
              label: 'Deadlift'
            },
            {
              data: data.map(item => item.total),
              strokeWidth: 2,
              label: 'Total'
            },
          ],
        }}
        width={Dimensions.get("window").width}
        height={220}
        yAxisLabel={'kg '}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#2e2e2e",
          backgroundGradientTo: "#606061",
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
          marginBottom: '17%',
          borderRadius: 10,
        }}
      />}
      </View>

    </View>
    
  );
};

// STYLE PART //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '7%'
  },
  squaresContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
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
    margin: 10,
    fontSize: 16,
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
  },
  tableCell1: {
    textAlign: 'center',
    fontSize: 20,
  },
  tableCell2: {
    textAlign: 'center',
    fontSize: 16,
  },
  flatlist: {
    width: '100%',
    marginTop: -3,
  },
});

export default App;
