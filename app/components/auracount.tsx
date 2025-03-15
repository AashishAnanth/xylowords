import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const AuraCount = () => {
  const [auraCount, setAuraCount] = useState<number | null>(null);

  useEffect(() => {
    const getAuraCount = async () => {
      const storedAuraCount = await SecureStore.getItemAsync('auraCount');
      if (storedAuraCount) {
        const aura = parseInt(storedAuraCount, 10);
        setAuraCount(aura);
      } else {
        setAuraCount(200); // Initial value
        await SecureStore.setItemAsync('auraCount', '200');
      }
    };

    getAuraCount();

    const interval = setInterval(getAuraCount, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <View className="absolute top-5 right-5 flex-row items-center">
      <FontAwesome name="fire" size={24} color="orange" />
      <Text className="ml-2 text-xl text-[color:white] font-bold">{auraCount}</Text>
    </View>
  );
};

export default AuraCount;