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
        setAuraCount(parseInt(storedAuraCount, 10));
      } else {
        setAuraCount(100); // Default value
        await SecureStore.setItemAsync('auraCount', '100');
      }
    };

    getAuraCount();
  }, []);

  return (
    <View className="absolute top-5 right-5 flex-row items-center">
      <FontAwesome name="fire" size={24} color="orange" />
      <Text className="ml-2 text-xl text-[color:white] font-bold">{auraCount}</Text>
    </View>
  );
};

export default AuraCount;