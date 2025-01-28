// app/index.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { Link } from 'expo-router';

const Welcome = () => {
  return (
    <View className="flex-1 justify-center items-center bg-tan">
      <Text className="font-bold text-3xl mb-10 text-red-500">Welcome to XyloWords, player!</Text>
      <Link href="./(tabs)/play" asChild>
        <Button title="Sign In" />
      </Link>
    </View>
  );
};

export default Welcome;