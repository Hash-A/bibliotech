import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import SearchScreen from '../screens/SearchScreen';
import MyLibraryScreen from '../screens/MyLibraryScreen';
import ReaderScreen from '../screens/ReaderScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Bottom Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Search') iconName = 'magnify';
          else if (route.name === 'My Library') iconName = 'bookshelf';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="My Library" component={MyLibraryScreen} />
    </Tab.Navigator>
  );
}

// Root Navigator with stack
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Library" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Reader" component={ReaderScreen} options={{ title: 'Reader' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
