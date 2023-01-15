import React, { 
  useState,
  useEffect
} from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput , FlatList, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { LineChart } from 'react-native-chart-kit';



const App = () => {

  const [data, setData] = useState([]);
  
  useEffect(() => {
    AsyncStorage.getItem('data').then(data => {
        if(data){
          setData(JSON.parse(data));
        }else{
          setData([]);
        }
    });
  }, []);

  const [squat, setSquat] = useState('');
  const [bench, setBench] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [total, setTotal] = useState(0);
  


  const handleTotal = async () => {

    let date = new Date();
    date = date.toDateString();

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


  return (
    <View style={styles.container}>
      <View style={styles.squaresContainer}>
        <TouchableOpacity style={styles.square} onPress={() => alert('Enter squat value')}>
          <TextInput
            style={styles.input}
            onChangeText={text => setSquat(text)}
            value={squat}
            keyboardType='numeric'
          />
          <Text style={styles.text}>Squat</Text>
          <Text style={styles.value}>{squat}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.square} onPress={() => alert('Enter bench value')}>
          <TextInput
            style={styles.input}
            onChangeText={text => setBench(text)}
            value={bench}
            keyboardType='numeric'
          />
          <Text style={styles.text}>Bench</Text>
          <Text style={styles.value}>{bench}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.square} onPress={() => alert('Enter deadlift value')}>
          <TextInput
            style={styles.input}
            onChangeText={text => setDeadlift(text)}
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
      <FlatList
        style={styles.flatlist}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.squat}</Text>
            <Text style={styles.tableCell}>{item.bench}</Text>
            <Text style={styles.tableCell}>{item.deadlift}</Text>
            <Text style={styles.tableCell1}>{item.total} kg</Text>
            <Text style={styles.tableCell2}>{item.date}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
        yAxisLabel={'kg'}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />


    </View>
    
  );
};

// STYLE PART //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%'
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  totalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDelete: {
    color: 'red',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    marginTop: 20,
  },
  tableCell1: {
    width: '40%',
    textAlign: 'center',
    fontSize: 20,
  },
  tableCell2: {
    width: '40%',
    textAlign: 'center',
    fontSize: 16,
  },
  flatlist: {
    width: '100%',
    margin: 10,
    
  }
});

export default App;
