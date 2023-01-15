import React, { 
  useState 
} from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput , FlatList
} from 'react-native';

const App = () => {
  const [squat, setSquat] = useState('');
  const [bench, setBench] = useState('');
  const [deadlift, setDeadlift] = useState('');
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const handleTotal = () => {

    let date = new Date();
    date = date.toDateString();

    const squatValue = parseInt(squat) || 0;
    const benchValue = parseInt(bench) || 0;
    const deadliftValue = parseInt(deadlift) || 0;
    
    const newTotal = squatValue + benchValue + deadliftValue;
    setTotal(newTotal);
    setData([...data, { total: newTotal, date}]);
  }
  

  const handleDelete = (date) => {
    setData(data.filter(item => item.date !== date));
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
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalValue}>{total}</Text>
          <TouchableOpacity style={styles.totalButton} onPress={handleTotal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.flatlist}
        data={data}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.total}</Text>
            <Text style={styles.tableCell}>{item.date}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.date)}>
              <Text style={styles.buttonDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
    
  );
};

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
    width: '20%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    margin: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
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
  tableCell: {
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
