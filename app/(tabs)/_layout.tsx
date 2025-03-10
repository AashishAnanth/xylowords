import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AuraCount from '../components/auracount';
import * as SecureStore from 'expo-secure-store';

export default function TabsLayout() {
  const [username, setUsername] = useState('');
  const [auraCount, setAuraCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    const fetchAuraCount = async () => {
      const storedAuraCount = await SecureStore.getItemAsync('auraCount');
      if (storedAuraCount) {
        setAuraCount(parseInt(storedAuraCount, 10));
      } else {
        setAuraCount(100); // Default value
        await SecureStore.setItemAsync('auraCount', '100');
      }
    };

    fetchUsername();
    fetchAuraCount();
  }, []);

  return (
    <>
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
            title: 'Time trial',
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
    </>
  );
}