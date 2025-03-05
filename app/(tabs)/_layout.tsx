import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AuraCount from '../components/auracount';
import { AuraCountProvider } from '../components/auracountcontext';
import * as SecureStore from 'expo-secure-store';

export default function TabsLayout() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    fetchUsername();
  }, []);

  return (
    <>
      <AuraCountProvider>
        <Tabs
          screenOptions={{
            headerStyle: { backgroundColor: '#a45a45' },
            headerTintColor: 'white',
            tabBarStyle: { backgroundColor: '#a45a45' },
            tabBarActiveTintColor: '#ffd700',
            tabBarInactiveTintColor: 'white',
          }}
        >
          <Tabs.Screen
            name="play"
            options={{
              title: 'Begin a time trial',
              tabBarLabel: 'Play',
              tabBarIcon: ({ color }) => 
                <FontAwesome name="gamepad" size={24} color={color} />
            }}
          />
          <Tabs.Screen
            name="learn"
            options={{
              title: 'Search the docs',
              tabBarLabel: 'Learn',
              tabBarIcon: ({ color }) => 
                <FontAwesome name="book" size={24} color={color} />
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: `${username}'s stats`,
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color }) => 
                <FontAwesome name="user" size={24} color={color} />
            }}
          />
        </Tabs>
        <AuraCount />
      </AuraCountProvider>
    </>
  );
}