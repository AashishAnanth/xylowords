import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import CustomInput from '../components/custominput';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const categoryAbbreviations: Record<string, string> = {
  syntax: 'SYN',
  wordChoice: 'WCH',
  vocabulary: 'VCB',
  sentenceStructure: 'SST',
};

const commitmentLevels = ['Developing', 'Practitioner', 'Advanced'];

export default function Profile() {
  const [stats, setStats] = useState<Record<string, { correct: number; total: number }>>({
    syntax: { correct: 0, total: 0 },
    wordChoice: { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
    sentenceStructure: { correct: 0, total: 0 },
  });
  const [timeTrials, setTimeTrials] = useState<number>(0);
  const [username, setUsername] = useState('');
  const [commitmentLevel, setCommitmentLevel] = useState('Developing');

  const fetchStats = async () => {
    try {
      const storedStats = await SecureStore.getItemAsync('stats');
      const storedTimeTrials = await SecureStore.getItemAsync('timeTrials');
      const storedUsername = await SecureStore.getItemAsync('username');
      const storedCommitmentLevel = await SecureStore.getItemAsync('commitmentLevel');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
      if (storedTimeTrials) {
        setTimeTrials(parseInt(storedTimeTrials, 10));
      }
      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedCommitmentLevel) {
        setCommitmentLevel(storedCommitmentLevel);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  const handleUsernameChange = async (newUsername: string) => {
    setUsername(newUsername);
    await SecureStore.setItemAsync('username', newUsername);
  };

  const handleCommitmentLevelChange = async (direction: 'left' | 'right') => {
    const currentIndex = commitmentLevels.indexOf(commitmentLevel);
    let newIndex = currentIndex;

    if (direction === 'left' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < commitmentLevels.length - 1) {
      newIndex = currentIndex + 1;
    }

    const newCommitmentLevel = commitmentLevels[newIndex];
    setCommitmentLevel(newCommitmentLevel);
    await SecureStore.setItemAsync('commitmentLevel', newCommitmentLevel);
  };

  const totalQuestions = Object.values(stats).reduce((sum, category) => sum + category.total, 0);
  const totalCorrect = Object.values(stats).reduce((sum, category) => sum + category.correct, 0);
  const timePerAnswer = timeTrials > 0 ? (60 * timeTrials) / totalQuestions : 0;
  const timePerCorrectAnswer = timeTrials > 0 ? (60 * timeTrials) / totalCorrect : 0;

  return (
    <View className="flex-1 justify-start items-center bg-tan p-4">
      <View className="w-full">
        <View className="flex-row justify-around mb-4">
          <View className="items-center">
            <Text className="text-lg text-gray-600">Avg. Time / Answer</Text>
            <Text className="text-3xl font-bold text-[#a45a45]">{timePerAnswer.toFixed(2)}s</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg text-gray-600">Avg. Time / Correct Answer</Text>
            <Text className="text-3xl font-bold text-[#a45a45]">{timePerCorrectAnswer.toFixed(2)}s</Text>
          </View>
        </View>
        <View className="items-center">
          <Text className="mt-2 mb-4 text-xl font-bold">Performance by Category</Text>
        </View>
        <View className="flex-row justify-around">
          {Object.keys(stats).map(category => (
            <View key={category} className="items-center mb-4">
              <Text className="text-lg text-gray-600">{categoryAbbreviations[category]}</Text>
              <Text className="text-2xl font-bold text-[#a45a45]">
                {stats[category].correct} / {stats[category].total}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row mt-4 mx-4">
          <View className="w-1/2 pr-2">
            <Text className="text-lg text-gray-600">Username</Text>
            <CustomInput
              placeholder="Username"
              value={username}
              onChangeText={handleUsernameChange}
              style={{ marginBottom: 10, width: '80%' }}
            />
          </View>
          <View className="w-1/2 pl-2">
            <Text className="text-lg text-gray-600">Commitment Level</Text>
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => handleCommitmentLevelChange('left')}>
                <FontAwesome name="caret-left" size={40} color="#a45a45" />
              </TouchableOpacity>
              <Text className="mx-6 text-lg">{commitmentLevel}</Text>
              <TouchableOpacity onPress={() => handleCommitmentLevelChange('right')}>
                <FontAwesome name="caret-right" size={40} color="#a45a45" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}