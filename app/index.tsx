import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';

const Welcome = () => {
  return (
    <View className="flex-1 justify-center items-center bg-tan text-center">
      <Image 
        source={require('../assets/logo.png')} 
        className="w-60 h-60 mb-10" 
      />
      <Text className="font-bold text-3xl mb-5">Xylowords</Text>
      <Text className="text-xl mb-10 w-2/3 text-center">Reach new English heights in this epic learning arena.</Text>
      <Link href="./(tabs)/play" asChild>
        <TouchableOpacity className="bg-[#ffd700] border-2 border-[#a45a45] rounded-full py-2 px-4">
          <Text className="text-white text-lg font-bold">Get Started</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Welcome;