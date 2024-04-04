import React, { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { Exercise } from '../types/DBTypes';

const CardioExerciseInfo = ({ exercise }: { exercise: Exercise }) => {
  const { exercise_distance, exercise_duration } = exercise;

  const [animatedWidth] = useState(new Animated.Value(0));

  const calculateIntensity = () => {
    const durationInHours = exercise_duration / 60;
    const pace = exercise_distance / durationInHours;
    if (pace < 5) {
      return { level: 'Low Intensity', color: 'green', numericLevel: 1 };
    } else if (pace >= 5 && pace <= 8) {
      return { level: 'Moderate Intensity', color: 'orange', numericLevel: 2 };
    } else {
      return { level: 'High Intensity', color: 'red', numericLevel: 3 };
    }
  };

  const intensity = calculateIntensity();


  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: intensity.numericLevel, // Low = 1, Moderate = 2, High = 3
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [intensity.numericLevel]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 3],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View className='items-center p-5'>
      <Text className='text-base text-black mb-2.5'>Intensity:</Text>
      <View className='w-full h-5 bg-gray-300 rounded-lg overflow-hidden mb-2.5'>
        <Animated.View style={{ width: widthInterpolation, backgroundColor: intensity.color, height: '100%', borderRadius: 9999 }} />
      </View>
      <Text style={{ color: intensity.color, fontWeight: 'bold', fontSize: 16 }}>
        {intensity.level}
      </Text>
    </View>
  );
};

export default CardioExerciseInfo;
