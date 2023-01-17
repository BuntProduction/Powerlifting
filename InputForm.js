import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InputForm = ({ data, setData, squat,bench,handleBenchChange, handleSquatChange, deadlift, handleDeadliftChange, handleTotal }) => {
  const handleFormSubmit = async () => {
    let date = new Date();
    let options = { day: 'numeric', month: 'numeric' };
    date = date.toLocaleDateString('fr-FR', options);

    const squatValue = parseInt(squat) || 0;
    const benchValue = parseInt(bench) || 0;
    const deadliftValue = parseInt(deadlift) || 0;
    const totalValue = squatValue + benchValue + deadliftValue;

    let newData = [...data, { squat: squatValue, bench: benchValue, deadlift: deadliftValue, total: totalValue, date }];
    setData(newData);

    await AsyncStorage.setItem('data', JSON.stringify(newData));
    await AsyncStorage.setItem('squat', squat);
    await AsyncStorage.setItem('bench', bench);
    await AsyncStorage.setItem('deadlift', deadlift);
  }

  return (
    <View style={styles.container}>
      <TextInput
      ref={squatInputRef}
        style={styles.input}
        onChangeText={handleSquatChange}
        value={squat}
        keyboardType='numeric'
      />
      <TextInput
      ref={benchInputRef}
        style={styles.input}
        onChangeText={handleBenchChange}
        value={bench}
        keyboardType='numeric'
      />
      <TextInput
      ref={deadliftInputRef}
        style={styles.input}
        onChangeText={handleDeadliftChange}
        value={deadlift}
        keyboardType='numeric'
      />

      <TouchableOpacity style={styles.button} onPress={handleTotal}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

export {InputForm};