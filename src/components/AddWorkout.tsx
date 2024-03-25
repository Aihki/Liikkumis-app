import React, { useState } from 'react'
import { TextInput, View, TouchableOpacity, Text } from 'react-native'
import { useWorkouts } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

const AddWorkout: React.FC<AddWorkoutProps> = ({ onWorkoutAdded }) => {

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
      onWorkoutAdded();
      // Clear the form (optional)
      setWorkoutName('');
      setWorkoutDescription('');
    } catch (error: any) {
      console.error(error);
      console.error("Failed to add workout:", error.response ? error.response.data : error);
    }
  };

  return (
    <View className='flex flex-col items-center w-full pt-10 gap-3'>
      <TextInput
        placeholder="Workout Name"
        value={workout_name}
        onChangeText={setWorkoutName}
        className='p-2 border-gray-300 bg-gray-100 border w-[90%] rounded-xl'
      />
      <TextInput
        placeholder="Workout Description"
        value={workout_description}
        onChangeText={setWorkoutDescription}
        className='p-2 border-gray-300 bg-gray-100 border w-[90%] rounded-xl '
      />
      <TouchableOpacity
        onPress={addWorkoutHandler}
        className='px-4 py-2 bg-blue-500 rounded-xl'
      >
        <Text className='text-white text-[20px] font-medium'>Add Workout</Text>
    </TouchableOpacity>
    </View>
  )
}

export default AddWorkout
