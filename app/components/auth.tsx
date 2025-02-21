import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Link } from 'expo-router';
import CustomInput from './custominput';
import CustomButton from "./custombutton";

export default function Auth() {
  const [commitmentLevel, setCommitmentLevel] = useState('Developing');

  const handleSubmit = () => {
    // Handle form submission
    Alert.alert('Form Submitted', `Commitment Level: ${commitmentLevel}`);
  };

  return (
    <View className="flex-1 p-5 bg-white items-center">
      <View className="w-1/2">
        <CustomInput placeholder="Email" style={{ marginBottom: 10 }} />
        <CustomInput placeholder="Password" secureTextEntry style={{ marginBottom: 10 }} />
        <CustomInput placeholder="Username" style={{ marginBottom: 10 }} />
      </View>
      <Text className="text-lg font-bold my-6">Commitment Level:</Text>
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
      <Link href="./(tabs)/play" asChild>
        <CustomButton title="Submit" onPress={handleSubmit} />
      </Link>
    </View>
  );
}