import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CustomButton from '../components/custombutton';
import { questions, Question } from './questions';

type TimeTrialProps = {
  onBack: () => void;
  selectedCategories: string[];
};

const getRandomQuestion = (categories: string[]): Question | null => {
  const filteredQuestions = questions.filter(question => categories.includes(question.category));
  if (filteredQuestions.length === 0) {
    return null;
  }
  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
};

const TimeTrial: React.FC<TimeTrialProps> = ({ onBack, selectedCategories }) => {
  const [timeLeft, setTimeLeft] = useState(60); // Set initial time to 60 seconds
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  useEffect(() => {
    const initialQuestion = getRandomQuestion(selectedCategories);
    setQuestion(initialQuestion);
  }, []);

  const handleBackPress = () => {
    onBack();
  };

  const handleAnswerPress = (key: "A" | "B" | "C") => {
    if (question) {
      if (question.answer === key) {
        setFeedback("Correct!");
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