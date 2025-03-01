import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AuraCountContext } from './auracountcontext';

const AuraCount = () => {
  const context = useContext(AuraCountContext);

  if (!context) {
    throw new Error('AuraCount must be used within an AuraCountProvider');
  }

  const { auraCount } = context;

  return (
    <View className="absolute top-5 right-5 flex-row items-center">
      <FontAwesome name="fire" size={24} color="orange" />
      <Text className="ml-2 text-xl text-[color:white] font-bold">{auraCount}</Text>
    </View>
  );
};

export default AuraCount;