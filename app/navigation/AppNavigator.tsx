// src/navigation/AppNavigator.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { COLORS } from '../constants/colors';

import AddNoteScreen from '../screens/notes/AddNoteScreen';
import CategoryNotesScreen from '../screens/notes/CategoryNotesScreen';
import EditNoteScreen from '../screens/notes/EditNoteScreen';
import HomeScreen from '../screens/notes/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import { RootStackParamList, TabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab Navigator for main app sections
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.darker,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lighter,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Notes',
          tabBarIcon: () => '📝',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => '👤',
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator with Stack
const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen 
        name="AddNote" 
        component={AddNoteScreen}
        options={{
          headerShown: true,
          title: 'Add Note',
          headerStyle: { backgroundColor: COLORS.darker },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen 
        name="EditNote" 
        component={EditNoteScreen}
        options={{
          headerShown: true,
          title: 'Edit Note',
          headerStyle: { backgroundColor: COLORS.darker },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen 
        name="CategoryNotes" 
        component={CategoryNotesScreen}
        options={{
          headerShown: true,
          title: 'Category',
          headerStyle: { backgroundColor: COLORS.darker },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;