import 'react-native-get-random-values';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from 'react-native';
import HomeScreen from './HomeScreen';
import SBD from './SBD';
import StreetLifting from './StreetLifting';
import Weight from './Weight';
import SettingsScreen from './SettingsScreen';
//For example, you can pass down the data, squat, bench, deadlift, and handleTotal functions from the App component as props to the InputForm component, and use them within the InputForm component to update the AsyncStorage and the state of the App component.
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
const App = () => {

  const Tab = createBottomTabNavigator();

  const colorIcon = '#97A4B3';
  const colorIconFocused = '#03C2DB';
  
  return (

    
    <NavigationContainer>
    <Tab.Navigator
    screenOptions={{
      tabBarLabel: ({ focused }) => {
        return focused ? null : null;
      },
      tabBarStyle: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 43,
        borderColor: 'white',
        borderTopWidth: 0,
        height: 60,
        elevation: 4,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 0, height: 11 },
        shadowOpacity: 1,
        shadowRadius: 16,
      }
    }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Ionicons name='ios-home' size={size} color={focused ? colorIconFocused : colorIcon} />;
          },
          headerShown: false
        }}
      />
      <Tab.Screen
        name="SBD"
        component={SBD}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <MaterialCommunityIcons name='weight-lifter' size={size} color={focused ? colorIconFocused : colorIcon} />;
          },
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Streetlifting" 
        component={StreetLifting} 
        options={{ 
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome5 name='weight-hanging' size={size} color={focused ? colorIconFocused : colorIcon} />;
          },
          headerShown: false }}
        />
      <Tab.Screen 
        name="Weight" 
        component={Weight} 
        options={{ 
          tabBarIcon: ({ focused, color, size }) => {
            return <FontAwesome5 name='weight' size={size} color={focused ? colorIconFocused : colorIcon} />;
          },
          headerShown: false }}
        />
      <Tab.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ 
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name='md-settings' size={size} color={focused ? colorIconFocused : colorIcon} />;
        },
        headerShown: false }}/>
    </Tab.Navigator>
  </NavigationContainer>
      
      
      )}
      
export default App;
