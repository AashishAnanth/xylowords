import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../components/custombutton';
import TimeTrial from '../components/timetrial';
import DailyPuzzle from '../components/dailypuzzle';
import { tips } from '../collections/tips';

type Category = 'syntax' | 'wordChoice' | 'vocabulary' | 'sentenceStructure';

const wagers = [50, 250, 1000, 5000, 25000, 100000];

export default function Play() {
  const [categories, setCategories] = useState<Record<Category, boolean>>({
    syntax: false,
    wordChoice: false,
    vocabulary: false,
    sentenceStructure: false,
  });

  const [selectedWager, setSelectedWager] = useState<number>(wagers[0]);
  const [auraCount, setAuraCount] = useState<number | null>(null);
  const [showTimeTrial, setShowTimeTrial] = useState(false);
  const [showDailyPuzzle, setShowDailyPuzzle] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [currentTip, setCurrentTip] = useState<string>('');
  const [dailyPuzzleCompleted, setDailyPuzzleCompleted] = useState<boolean>(false);

  useEffect(() => {
    const getAuraCount = async () => {
      const storedAuraCount = await SecureStore.getItemAsync('auraCount');
      if (storedAuraCount) {
        const aura = parseInt(storedAuraCount, 10);
        if (isNaN(aura)) {
          setAuraCount(200);
          await SecureStore.setItemAsync('auraCount', '200');
        } else {
          setAuraCount(aura);
        }
      } else {
        setAuraCount(200); 
        await SecureStore.setItemAsync('auraCount', '200');
      }
    };

    const checkDailyPuzzleCompletion = async () => {
      const today = new Date().toDateString();
      const storedCompletionDate = await SecureStore.getItemAsync('dailyPuzzleCompletionDate');
      if (storedCompletionDate === today) {
        setDailyPuzzleCompleted(true);
      } else {
        setDailyPuzzleCompleted(false);
      }
    };

    getAuraCount();
    checkDailyPuzzleCompletion();
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getRandomTip = () => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setCurrentTip(tips[randomIndex]);
    };

    getRandomTip();
    const tipInterval = setInterval(getRandomTip, 10000);

    return () => clearInterval(tipInterval);
  }, []);

  const calculateTimeLeft = () => {
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = nextDay.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeLeft(`Refreshes in ${hours} hrs, ${minutes} min`);
  };

  const handleStart = async () => {
    const storedAuraCount = await SecureStore.getItemAsync('auraCount');
    const aura = storedAuraCount ? parseInt(storedAuraCount, 10) : 200;
    if (isNaN(aura)) {
      setAuraCount(200);
      await SecureStore.setItemAsync('auraCount', '200');
    } else {
      setAuraCount(aura);
    }
    const selectedCategories = Object.keys(categories).filter(category => categories[category as Category]);
    if (selectedCategories.length === 0) {
      Alert.alert("No category selected", "Please select at least one question type.");
      return;
    }
    
    if (auraCount !== null && auraCount < selectedWager) {
      Alert.alert("Low Aura", "You don't have enough aura to wager.");
      return;
    }
    
    // Decrease aura count by the selected wager
    const newAuraCount = Math.max((auraCount ?? 0) - selectedWager, 50);
    if (newAuraCount < 50) {
      Alert.alert("Low Aura", "You don't have enough aura to wager.");
      return;
    }
    
    setAuraCount(newAuraCount);
    await SecureStore.setItemAsync('auraCount', newAuraCount.toString());
    setShowTimeTrial(true);
  };

  const handleCategoryChange = (category: Category) => {
    setCategories(prevCategories => ({
      ...prevCategories,
      [category]: !prevCategories[category],
    }));
  };

  const handleWagerChange = (direction: 'left' | 'right') => {
    const currentIndex = wagers.indexOf(selectedWager);
    if (direction === 'left' && currentIndex > 0) {
      setSelectedWager(wagers[currentIndex - 1]);
    } else if (direction === 'right' && currentIndex < wagers.length - 1) {
      setSelectedWager(wagers[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    setShowTimeTrial(false);
    setShowDailyPuzzle(false);
  };

  const handleDailyPuzzleCompletion = async () => {
    const today = new Date().toDateString();
    await SecureStore.setItemAsync('dailyPuzzleCompletionDate', today);
    setDailyPuzzleCompleted(true);
  };

  if (showTimeTrial) {
    return <TimeTrial onBack={handleBack} 
    selectedCategories={Object.keys(categories).filter(category => categories[category as Category])} 
    selectedWager={selectedWager}/>;
  }

  if (showDailyPuzzle) {
    return <DailyPuzzle onBack={handleBack} onComplete={handleDailyPuzzleCompletion} />;
  }

  return (
    <View className="flex-1 items-center bg-tan">
      <View className="w-3/4 bg-white rounded-lg p-4">
        <Text className="font-bold text-xl mb-4 text-center">Question Types to Include</Text>
        <View className="flex-row justify-between mb-4">
          <View className="flex-row items-center">
            <Checkbox
              value={categories.syntax}
              onValueChange={() => handleCategoryChange('syntax')}
              color="#a45a45"
            />
            <Text className="ml-2">Syntax</Text>
          </View>
          <View className="flex-row items-center">
            <Checkbox
              value={categories.wordChoice}
              onValueChange={() => handleCategoryChange('wordChoice')}
              color="#a45a45"
            />
            <Text className="ml-2">Word Choice</Text>
          </View>
        </View>
        <View className="flex-row justify-between mb-4">
          <View className="flex-row items-center">
            <Checkbox
              value={categories.vocabulary}
              onValueChange={() => handleCategoryChange('vocabulary')}
              color="#a45a45"
            />
            <Text className="ml-2">Vocabulary</Text>
          </View>
          <View className="flex-row items-center">
            <Checkbox
              value={categories.sentenceStructure}
              onValueChange={() => handleCategoryChange('sentenceStructure')}
              color="#a45a45"
            />
            <Text className="ml-2">Sentence Structure</Text>
          </View>
        </View>
        <Text className="font-bold text-xl mt-4 text-center">How Much Will You Wager?</Text>
        <View className="flex-row justify-center items-center mt-4">
          <TouchableOpacity onPress={() => handleWagerChange('left')}>
            <FontAwesome name="caret-left" size={32} color="#a45a45" className="mr-4"/>
          </TouchableOpacity>
          <FontAwesome name="fire" size={24} color="orange" />
          <Text className="text-2xl ml-2">{selectedWager}</Text>
          <TouchableOpacity onPress={() => handleWagerChange('right')}>
            <FontAwesome name="caret-right" size={32} color="#a45a45" className="ml-4"/>
          </TouchableOpacity>
        </View>
        <View className="mt-6 items-center text-center">
          <View>
            <CustomButton title="Start" onPress={handleStart} />
          </View>
        </View>
        <Text className="font-bold text-xl mt-8 text-center">Try our Daily Puzzle</Text>
        <View className="mt-2 items-center w-7/8">
          <View className="flex-row justify-center items-center mt-4">
            {!dailyPuzzleCompleted && (
              <CustomButton title="Try It" onPress={() => setShowDailyPuzzle(true)} />
            )}
          </View>
          <Text className="mt-4 text-center">
            {dailyPuzzleCompleted ? "You've completed today's puzzle. " : ''}
            {timeLeft}
          </Text>
        </View>
        <View className="mt-10 items-center w-7/8">
          <View className="flex-row items-center">
            <FontAwesome name="lightbulb-o" size={24} color="black" />
            <Text className="ml-2 text-lg font-bold">Pro Tip:</Text>
          </View>
          <Text className="mt-2 text-lg text-center">{currentTip}</Text>
        </View>
      </View>
    </View>
  );
}