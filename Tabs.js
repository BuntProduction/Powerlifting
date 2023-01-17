import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {HomeScreen} from './HomeScreen';
import {StreetLifting} from './StreetLifting';
import {Weight} from './Weight';
import {SettingsScreen} from './SettingsScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    
    return(

        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Streetlifting" component={StreetLifting}/>
            <Tab.Screen name="Weight" component={Weight}/>
            <Tab.Screen name="SettingsScreen" component={SettingsScreen}/>
        </Tab.Navigator>


    )
}
export {Tabs};