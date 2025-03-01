import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';

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
        <Text className="font-bold text-xl mt-4 text-center">Choose Your Stake</Text>
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
      </View>
    </View>
  );
}