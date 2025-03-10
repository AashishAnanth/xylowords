import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import CustomButton from "./components/custombutton";
import Auth from "./components/auth";

const Welcome = () => {
  const [showAuth, setShowAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        router.replace('/(tabs)/play'); // Navigate to the tabs screen
      }
    };

    checkUsername();
  }, []);

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  return (
    <View className="flex-1 justify-center items-center bg-tan text-center">
      <Image 
        source={require('../assets/logo.png')} 
        className="w-60 h-60 mt-28" 
      />
      {!showAuth && (
        <>
          <Text className="font-bold text-3xl mb-5">Xylowords</Text>
          <Text className="text-xl mb-10 w-2/3 text-center">Reach new English heights in this epic learning arena.</Text>
          <CustomButton 
            title="Get Started"
            onPress={handleGetStarted}
          />
        </>
      )}
      {showAuth && <Auth />}
    </View>
  );
};

export default Welcome;