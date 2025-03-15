import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../components/custombutton';
import { questions, Question } from './questions';

type TimeTrialProps = {
  onBack: () => void;
  selectedCategories: string[];
  selectedWager: number;
};

const getRandomQuestion = (categories: string[]): Question | null => {
  const filteredQuestions = questions.filter(question => categories.includes(question.category));
  if (filteredQuestions.length === 0) {
    return null;
  }
  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
};

const categoryAbbreviations: Record<string, string> = {
  syntax: 'SYN',
  wordChoice: 'WCH',
  vocabulary: 'VCB',
  sentenceStructure: 'SST',
};

const TimeTrial: React.FC<TimeTrialProps> = ({ onBack, selectedCategories, selectedWager }) => {
  const [timeLeft, setTimeLeft] = useState(60); // Set initial time to 60 seconds
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
  const [correctFirstTry, setCorrectFirstTry] = useState<number>(0);
  const [categoryStats, setCategoryStats] = useState<Record<string, { correct: number; total: number }>>({
    syntax: { correct: 0, total: 0 },
    wordChoice: { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
    sentenceStructure: { correct: 0, total: 0 },
  });
  const [auraIncrement, setAuraIncrement] = useState<number>(0);

  useEffect(() => {
    const newQuestion = getRandomQuestion(selectedCategories);
    setQuestion(newQuestion);
  }, [selectedCategories]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Set an initial question when the component mounts
  useEffect(() => {
    const initialQuestion = getRandomQuestion(selectedCategories);
    setQuestion(initialQuestion);
  }, []);

  const handleBackPress = () => {
    onBack();
  };

  const handleAnswerPress = (key: "A" | "B" | "C") => {
    if (question) {
      setAnsweredQuestions(prev => prev + 1);
      setCategoryStats(prevStats => ({
        ...prevStats,
        [question.category]: {
          correct: prevStats[question.category].correct,
          total: prevStats[question.category].total + 1,
        },
      }));

      if (question.answer === key) {
        setFeedback("Correct!");
        setCorrectFirstTry(prev => prev + 1);
        setCategoryStats(prevStats => ({
          ...prevStats,
          [question.category]: {
            correct: prevStats[question.category].correct + 1,
            total: prevStats[question.category].total,
          },
        }));
        setTimeout(() => {
          setFeedback(null);
          const newQuestion = getRandomQuestion(selectedCategories);
          setQuestion(newQuestion);
          setQuestionNumber(prevNumber => prevNumber + 1);
        }, 1000); // Show feedback for 1 second
      } else {
        setFeedback("Incorrect. Try again!");
      }
    }
  };

  const xShare = async () => {
    const message = `I completed a #XylowordsApp time trial and got ${correctFirstTry} out of ${answeredQuestions} questions correct in 60 seconds! Think you can beat me? Find out by downloading Xylowords on the Play Store.`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    await WebBrowser.openBrowserAsync(url);
  };

  const saveStats = async () => {
    const storedStats = await SecureStore.getItemAsync('stats');
    const storedTimeTrials = await SecureStore.getItemAsync('timeTrials');
    const storedAuraCount = await SecureStore.getItemAsync('auraCount');
    const storedCommitmentLevel = await SecureStore.getItemAsync('commitmentLevel');
    
    const currentStats = storedStats ? JSON.parse(storedStats) : categoryStats;
    const currentTimeTrials = storedTimeTrials ? parseInt(storedTimeTrials, 10) : 0;
    const currentAuraCount = storedAuraCount ? parseInt(storedAuraCount, 10) : 0;
  
    const updatedStats = { ...currentStats };
    Object.keys(categoryStats).forEach(category => {
      updatedStats[category].correct += categoryStats[category].correct;
      updatedStats[category].total += categoryStats[category].total;
    });
  
    const correct = correctFirstTry;
    const attempted = answeredQuestions;
    const incorrect = attempted - correct;
    const auraIncrement = ((correct - 0.5 * incorrect) / attempted) * (attempted / 16) * 1.6;
    setAuraIncrement(auraIncrement); // Store the aura increment in state
  
    const updatedAuraCount = currentAuraCount + auraIncrement;
  
    await SecureStore.setItemAsync('stats', JSON.stringify(updatedStats));
    await SecureStore.setItemAsync('timeTrials', (currentTimeTrials + 1).toString());
    await SecureStore.setItemAsync('auraCount', updatedAuraCount.toString());
  };
  
  useEffect(() => {
    if (timeLeft === 0) {
      saveStats();
    }
  }, [timeLeft]);

  if (timeLeft === 0) {
    const accuracy = ((correctFirstTry / answeredQuestions) * 100).toFixed(2);
    return (
      <View className="flex-1 items-center bg-tan p-4">
        <Text className="mt-6 text-3xl font-bold">Your Results</Text>
        <View className="flex-row justify-around mt-6 w-full">
          <View className="items-center">
            <Text className="text-lg text-gray-600">Answered</Text>
            <Text className="text-3xl font-bold text-[#a45a45]">{answeredQuestions}</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg text-gray-600">First Try</Text>
            <Text className="text-3xl font-bold text-[#a45a45]">{correctFirstTry}</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg text-gray-600">Accuracy</Text>
            <Text className="text-3xl font-bold text-[#a45a45]">{accuracy}%</Text>
          </View>
        </View>
        <Text className="mt-6 text-xl font-bold">Performance by Category</Text>
        <View className="flex-row justify-around mt-4 w-full">
          {Object.keys(categoryStats).map(category => (
            <View key={category} className="items-center">
              <Text className="text-lg text-gray-600">{categoryAbbreviations[category]}</Text>
              <Text className="text-2xl font-bold text-[#a45a45]">
                {categoryStats[category].correct} / {categoryStats[category].total}
              </Text>
            </View>
          ))}
        </View>
        <View className="mt-6 items-center">
          <Text className="text-xl font-bold">Aura Increment</Text>
          <View className="flex-row items-center mt-2">
            <FontAwesome name="fire" size={24} color="orange" />
            <Text className="ml-2 text-xl font-bold" style={{ color: auraIncrement >= 0 ? 'green' : 'red' }}>
              {auraIncrement >= 0 ? `+${auraIncrement.toFixed(2)}` : `${auraIncrement.toFixed(2)}`}
            </Text>
          </View>
          <Text className="mt-2 text-lg text-center">
            ({correctFirstTry} - 0.5 * {answeredQuestions - correctFirstTry}) / {answeredQuestions} * {answeredQuestions} / 16 * 1.6
          </Text>
        </View>
        <View className="flex-row justify-around mt-6 w-full">
          <CustomButton title="Brag on X" onPress={xShare} />
          <CustomButton title="Back" onPress={handleBackPress} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center bg-tan">
      {timeLeft > -100 && (
        <TouchableOpacity onPress={handleBackPress} className="absolute top-5 left-5">
          <FontAwesome name="caret-left" size={32} color="#a45a45" />
        </TouchableOpacity>
      )}
      <Text className="mt-6 text-3xl font-bold" style={{ color: timeLeft <= 10 ? '#8b0000' : 'black' }}>
        {timeLeft}
      </Text>
      <Text className="mt-6 text-2xl font-bold">Question #{questionNumber}</Text>
      {question && (
        <View className="mt-4 w-3/4 items-center">
          <Text className="text-xl text-center mb-8">{question.question}</Text>
          {question.choices.map((choice, index) => (
            <View key={index} className="mb-2 w-1/2">
              <CustomButton title={choice} onPress={() => handleAnswerPress(String.fromCharCode(65 + index) as "A" | "B" | "C")} />
            </View>
          ))}
        </View>
      )}
      {feedback && (
        <Text className="mt-4 text-xl font-bold" style={{ color: feedback === "Correct!" ? 'green' : 'red' }}>
          {feedback}
        </Text>
      )}
    </View>
  );
};

export default TimeTrial;