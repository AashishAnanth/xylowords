import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { questions, Question } from './questions';

type TimeTrialProps = {
  onBack: () => void;
  selectedCategories: string[];
};

const getRandomQuestion = (categories: string[]): Question => {
  const filteredQuestions = questions.filter(question => categories.includes(question.category));
  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
};

const TimeTrial: React.FC<TimeTrialProps> = ({ onBack, selectedCategories }) => {
  const [timeLeft, setTimeLeft] = useState(100);
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    setQuestion(getRandomQuestion(selectedCategories));
  }, [selectedCategories]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <View className="flex-1 items-center bg-tan">
      {timeLeft > 90 && (
        <TouchableOpacity onPress={onBack} className="absolute top-5 left-5">
          <FontAwesome name="caret-left" size={32} color="#a45a45" />
        </TouchableOpacity>
      )}
      <Text className="mt-6 text-3xl font-bold" style={{ color: timeLeft <= 10 ? '#8b0000' : 'black' }}>
        {timeLeft}
      </Text>
      {question && (
        <View className="mt-6">
          <Text className="text-xl">{question.question}</Text>
          {question.choices.map((choice, index) => (
            <Text key={index} className="text-lg">{choice}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default TimeTrial;