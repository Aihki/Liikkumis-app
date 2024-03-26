import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AddWorkout from '../components/AddWorkout';
import Workouts from '../components/Workouts';


const Exercise = () => {
  const [updateWorkouts, setUpdateWorkouts] = useState(false);

  const triggerWorkoutsUpdate = () => {
    setUpdateWorkouts(prevState => !prevState); // Toggle to trigger useEffect
  };

  return (
    <View>
      <AddWorkout onWorkoutAdded={triggerWorkoutsUpdate} />
      <View className='border-b p-2 border-gray-300 '></View>
      <Workouts updateWorkouts={updateWorkouts} />
    </View>
  );
};

export default Exercise;
