import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, View, Text, TouchableOpacity } from "react-native"
import { useUserContext } from "../hooks/ContextHooks";
import { useExcersise } from "../hooks/apiHooks";
import { useState } from "react";
import { Picker } from '@react-native-picker/picker';
import { Exercise } from "../types/DBTypes";


interface AddExerciseProps {
  workoutId: number;
}

const AddExercise: React.FC<AddExerciseProps> = ({ workoutId }) => {

  const { user } = useUserContext();
  const { addExercise } = useExcersise();

  const [exerciseName, setExerciseName] = useState<string>('')
  const [exerciseWeight, setExerciseWeight] = useState<number>(0)
  const [exerciseReps, setExerciseReps] = useState<number>(0);

  const weightOptions = [1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const repOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25];



  const addAnExercise = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user ) return
    try {
      const exercises = {
        user_id: user.user_id,
        user_workout_id: workoutId,
        exercise_name: exerciseName,
        exercise_weight: exerciseWeight,
        exercise_reps: exerciseReps,
      };
      await addExercise(workoutId, exercises, token)
      console.log("Exercise added successfully.")
      setExerciseName('')
      setExerciseWeight(0);
      setExerciseReps(0);
    } catch (error) {
      console.error(error)
      console.error("Failed to add exercise:", error)
    }
  }


  return (
    <View className='flex flex-col items-center w-full pt-10 gap-3'>
      <Text className="font-medium text-[20px]">Add Exercise</Text>
      <TextInput
        placeholder="Exercise Name"
        value={exerciseName}
        onChangeText={setExerciseName}
        className='p-2 border-gray-300 bg-gray-100 border w-[90%] rounded-xl'
      />
      <Text>Exercise Weight</Text>
      <Picker
        selectedValue={exerciseWeight}
        onValueChange={(itemValue, itemIndex) =>
          setExerciseWeight(itemValue)
        }
        style={{ height: 50, width: 150 }}
      >
        {weightOptions.map((weight) => (
          <Picker.Item label={`${weight} kg`} value={weight} key={weight} />
        ))}
      </Picker>
      <Text>Exercise Reps</Text>
      <Picker
        selectedValue={exerciseReps}
        onValueChange={(itemValue, itemIndex) =>
          setExerciseReps(itemValue)
        }
        style={{ height: 50, width: 150 }}
      >
        {repOptions.map((rep) => (
          <Picker.Item label={`${rep}`} value={rep} key={rep} />
        ))}
      </Picker>
      <TouchableOpacity
        onPress={addAnExercise}
        className='px-4 py-2 bg-blue-500 rounded-xl'
      >
        <Text className='text-white text-[20px] font-medium'>Add Exercise</Text>
    </TouchableOpacity>
    </View>
  )
}

export default AddExercise
