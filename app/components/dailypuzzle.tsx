import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CustomInput from './custominput';
import CustomButton from './custombutton';
import { puzzles } from './puzzles';
import * as SecureStore from 'expo-secure-store';

interface DailyPuzzleProps {
  onBack: () => void;
  onComplete: () => void;
}

const DailyPuzzle: React.FC<DailyPuzzleProps> = ({ onBack, onComplete }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzles[0]);
  const [guess, setGuess] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [hints, setHints] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string, color: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const date = new Date().getDate();
    const puzzleIndex = date <= 16 ? date - 1 : (date - 1) % 16;
    setCurrentPuzzle(puzzles[puzzleIndex]);
    setHints([puzzles[puzzleIndex].hints[0]]);
  }, []);

  const handleGuess = async () => {
    if (guess.toLowerCase() === currentPuzzle.word.toLowerCase()) {
      setMessage({ text: `Nice job! The word was ${currentPuzzle.word}.`, color: 'green' });
      setGameOver(true);

      // Increment aura count by 100
      const storedAuraCount = await SecureStore.getItemAsync('auraCount');
      const currentAuraCount = storedAuraCount ? parseInt(storedAuraCount, 10) : 0;
      const updatedAuraCount = currentAuraCount + 100;
      await SecureStore.setItemAsync('auraCount', updatedAuraCount.toString());

      await SecureStore.setItemAsync('dailyPuzzleCompletionDate', new Date().toDateString());
      onComplete();
      return;
    }

    if (hintIndex < 4) {
      setHintIndex(hintIndex + 1);
      setHints([...hints, currentPuzzle.hints[hintIndex + 1]]);
      setMessage({ text: 'Incorrect, try again!', color: 'red' });
    } else {
      setMessage({ text: "Game Over. Try again tomorrow!", color: 'red' });
      setGameOver(true);
      await SecureStore.setItemAsync('dailyPuzzleCompletionDate', new Date().toDateString());
      onComplete();
    }
  };

  return (
    <View className="flex-1 items-center bg-tan">
      <View className="w-full flex-row justify-between items-center p-4">
        <TouchableOpacity onPress={onBack} className="p-2">
          <FontAwesome name="arrow-left" size={24} color="#a45a45" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-center">Guess the Vocabulary Word</Text>
        <Text style={{ width: 24 }}></Text>
      </View>
      <View className="flex-1 items-center">
        <Text className="text-lg text-center mb-8">
          Try and guess this 7-letter word with as few hints as possible! Hints get progressively more helpful.
        </Text>
        {hints.map((hint, index) => (
          <Text key={index} className="mb-4 text-lg text-center mx-4">{`${index + 1}. ${hint}`}</Text>
        ))}
        {!gameOver && (
          <>
            <CustomInput
              placeholder="Your guess"
              value={guess}
              onChangeText={setGuess}
              style={{ marginBottom: 10 }}
            />
            <CustomButton title="Guess or Move On" onPress={handleGuess} />
          </>
        )}
        {message && (
          <>
            <Text className="mt-4 text-xl" style={{ color: message.color }}>
              {message.text}
            </Text>
            {message.color === 'green' && (
              <View className="flex-row items-center mt-2">
                <FontAwesome name="fire" size={24} color="orange" />
                <Text className="ml-2 text-xl font-bold" style={{ color: 'green' }}>
                  +100 Aura
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default DailyPuzzle;