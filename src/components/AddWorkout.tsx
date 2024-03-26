import React, { useState } from 'react'
import { TextInput, View, TouchableOpacity, Text, Platform  } from 'react-native'
import { useWorkouts } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddWorkoutProps {
  onWorkoutAdded: () => void;
}

const AddWorkout: React.FC<AddWorkoutProps> = ({ onWorkoutAdded }) => {

  const { postWorkout } = useWorkouts();
  const { user } = useUserContext();
  console.log
  const [workout_name, setWorkoutName] = useState('');
  const [workout_description, setWorkoutDescription] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || workoutDate;
    setShowDatePicker(Platform.OS === 'ios');
    setWorkoutDate(currentDate);
    console.log(currentDate)
  };

  const addWorkoutHandler = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!user || !token) {
      console.log("User or token not found.");
      return;
    }


    try {
      const workout = {
        user_id: user.user_id,
        workout_name,
        workout_description,
        workout_date: workoutDate.toISOString().split('T')[0],
      };
      await postWorkout(workout, token);
      console.log("Workout added successfully.");
      onWorkoutAdded();
      // Clear the form (optional)
      setWorkoutName('');
      setWorkoutDescription('');
      setWorkoutDate(new Date());
    } catch (error: any) {
      console.error(error);
      console.error("Failed to add workout:", error.response ? error.response.data : error);
    }
  };

  return (
    <View className='flex flex-col items-center w-full pt-3 gap-3'>
      <Text className='text-[22px] pb-1'>Add New Workout</Text>
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
      <View className='flex w-full items-center justify-center  flex-row'>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} className='p-2 bg-gray-200 border border-gray-400 w-[45%]'>
        <Text className='text-center'>Select Workout Date</Text>
      </TouchableOpacity>
      <Text
        className='w-[45%] text-center border-gray-400 border-y border-r p-2  bg-gray-200'
      >{workoutDate.toISOString().split('T')[0]}</Text>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={workoutDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
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
