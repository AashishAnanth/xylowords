import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import CustomInput from './custominput';
import CustomButton from "./custombutton";
import { FontAwesome } from '@expo/vector-icons';
import { tips } from './tips';

export default function Auth() {
  const [username, setUsername] = useState('');
  const [commitmentLevel, setCommitmentLevel] = useState('Developing');
  const [currentTip, setCurrentTip] = useState('');

  useEffect(() => {
    const getRandomTip = () => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setCurrentTip(tips[randomIndex]);
    };

    getRandomTip();
    const tipInterval = setInterval(getRandomTip, 10000);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <View className="flex-1 p-5 bg-white items-center">
      <View className="w-1/2">
        <CustomInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{ marginBottom: 10 }}
        />
      </View>
      <Text className="text-xl font-bold my-6">Choose your commitment level:</Text>
      <RadioButton.Group
        onValueChange={value => setCommitmentLevel(value)}
        value={commitmentLevel}
      >
        <View className="flex-row items-center my-1">
          <RadioButton value="Developing" />
          <Text className="ml-2 w-3/4">Developing: Low risk, low reward. Best for younger students and newcomers.</Text>
        </View>
        <View className="flex-row items-center my-1">
          <RadioButton value="Practitioner" />
          <Text className="ml-2 w-3/4">Practitioner: Some risk, some reward. Best for high school/college students.</Text>
        </View>
        <View className="flex-row items-center my-1">
          <RadioButton value="Advanced" />
          <Text className="ml-2 w-3/4">Advanced: High risk, high reward. Best for professionals using English.</Text>
        </View>
      </RadioButton.Group>
      <View className="mb-6"></View>
      <Link href="./(tabs)/play" asChild>
        <CustomButton title="Submit" onPress={() => { SecureStore.setItemAsync('username', username); }} />
      </Link>
      <View className="mt-10 items-center w-7/8">
        <View className="flex-row items-center">
          <FontAwesome name="lightbulb-o" size={24} color="black" />
          <Text className="ml-2 text-lg font-bold">Pro Tip:</Text>
        </View>
        <Text className="mt-2 text-lg text-center">{currentTip}</Text>
      </View>
    </View>
  );
}