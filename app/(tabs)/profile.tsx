import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const categoryAbbreviations: Record<string, string> = {
  syntax: 'SYN',
  wordChoice: 'WCH',
  vocabulary: 'VCB',
  sentenceStructure: 'SST',
};

export default function Profile() {
  const [stats, setStats] = useState<Record<string, { correct: number; total: number }>>({
    syntax: { correct: 0, total: 0 },
    wordChoice: { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
    sentenceStructure: { correct: 0, total: 0 },
  });
  const [timeTrials, setTimeTrials] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      const storedStats = await SecureStore.getItemAsync('stats');
      const storedTimeTrials = await SecureStore.getItemAsync('timeTrials');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
      if (storedTimeTrials) {
        setTimeTrials(parseInt(storedTimeTrials, 10));
      }
    };

    fetchStats();
  }, []);

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
      </View>
    </View>
  );
}