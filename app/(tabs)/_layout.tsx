import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AuraCount from '../components/auracount';
import * as SecureStore from 'expo-secure-store';

export default function TabsLayout() {
  const [auraCount, setAuraCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchAuraCount = async () => {
      try {
        const storedAuraCount = await SecureStore.getItemAsync('auraCount');
        if (storedAuraCount) {
          setAuraCount(parseInt(storedAuraCount, 10));
        } else {
          setAuraCount(200); // Default value
          await SecureStore.setItemAsync('auraCount', '200');
        }
      } catch (error) {
        console.error('Error fetching aura count:', error);
      }
    };

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
            title: 'Home',
            tabBarLabel: 'Play',
            tabBarIcon: ({ color }) => 
              <FontAwesome name="gamepad" size={24} color={color} />
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: `Stat corner`,
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