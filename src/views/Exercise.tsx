import React, { useState } from 'react';
import { Button, Text, Input } from '@rneui/base';
import { useWorkouts } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Exercise = () => {
  const { postWorkout } = useWorkouts();
  const { user } = useUserContext();
  console.log
  // State for the form fields
  const [workout_name, setWorkoutName] = useState('');
  const [workout_description, setWorkoutDescription] = useState('');

  const addWorkoutHandler = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!user || !token) {
      console.log("User or token not found.");
      return;
    }

    const workout_date = new Date().toISOString();

    try {
      const workout = {
        user_id: user.user_id,
        workout_name,
        workout_description,
        workout_date,
      };
      await postWorkout(workout, token);
      console.log("Workout added successfully.");

      // Clear the form (optional)
      setWorkoutName('');
      setWorkoutDescription('');
    } catch (error: any) {
      console.error(error);
      console.error("Failed to add workout:", error.response ? error.response.data : error);
    }
  };

  return (
    <>
      <Input
        placeholder="Workout Name"
        value={workout_name}
        onChangeText={setWorkoutName}
      />
      <Input
        placeholder="Workout Description"
        value={workout_description}
        onChangeText={setWorkoutDescription}
      />
      <Button
        title="Add Workout"
        onPress={addWorkoutHandler}
      />
    </>
  );
};

export default Exercise;
