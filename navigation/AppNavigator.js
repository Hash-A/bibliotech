import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; 
import ReaderScreen from '../screens/ReaderScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    console.log('HomeScreen:', HomeScreen);
    console.log('ReaderScreen:', ReaderScreen);

    return (
        <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="Library" component={HomeScreen} />
            <Tab.Screen name="Reader" component={ReaderScreen} />
        </Tab.Navigator>
        </NavigationContainer>
    );
}
