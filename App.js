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

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from './HomeScreen';
import StreetLifting from './StreetLifting';
import Weight from './Weight';
import SettingsScreen from './SettingsScreen';
//For example, you can pass down the data, squat, bench, deadlift, and handleTotal functions from the App component as props to the InputForm component, and use them within the InputForm component to update the AsyncStorage and the state of the App component.
import { FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';
const App = () => {

  const Tab = createBottomTabNavigator();


  
  return (

    
    <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Ionicons name='ios-home' size={size} color={color} />;
          },
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Streetlifting" 
        component={StreetLifting} 
        options={{ 
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome5 name='weight' size={size} color={color} />;
          },
          headerShown: false }}
        />
      <Tab.Screen 
        name="Weight" 
        component={Weight} 
        options={{ 
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome5 name='weight' size={size} color={color} />;
          },
          headerShown: false }}
        />
      <Tab.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ 
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name='md-settings' size={size} color={color} />;
        },
        headerShown: false }}/>
    </Tab.Navigator>
  </NavigationContainer>
      
      
      )}
      
export default App;
