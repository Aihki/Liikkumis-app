import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { UserWorkout } from "../types/DBTypes"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../hooks/ContextHooks";
import { useState } from "react";
import { ExerciseProps, RootStackParamList } from "../types/LocalTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Dropdown } from "react-native-element-dropdown";
import { useExercise } from "../hooks/apiHooks";


const GymExercise = ({ workout, workoutId }: ExerciseProps) => {
  const { user } = useUserContext();
  const { addExercise } = useExercise();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseWeight, setExerciseWeight] = useState<{ label: string; value: number; } | null>(null);
  const [exerciseReps, setExerciseReps] = useState<number | null>(null);
  const [exerciseSets, setExerciseSets] = useState<number | null>(null);

  const addAnExercise = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const exerciseWeightValue = exerciseWeight ? exerciseWeight.value : 0;
      const exerciseRepsValue = exerciseReps !== null ? exerciseReps : 0;
      const exerciseSetsValue = exerciseSets !== null ? exerciseSets : 0;

      const exercises = {
        user_id: user.user_id,
        user_workout_id: workoutId,
        exercise_name: exerciseName,
        exercise_weight: exerciseWeightValue,
        exercise_reps: exerciseRepsValue,
        exercise_sets: exerciseSetsValue,
        exercise_duration: 0,
        exercise_distance: 0,
      };

      await addExercise(user.user_id, exercises, token);

      setExerciseName('');
      setExerciseWeight(null);
      setExerciseReps(null);

      navigation.navigate('WorkoutDetails', { workoutId: workoutId, refresh: true });
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  const options = [
    { label: 'Bench Press', value: 'Bench Press' },
    { label: 'Squat Rack Squats', value: 'Squat Rack Squats' },
    { label: 'Deadlift', value: 'Deadlift' },
    { label: 'Leg Press', value: 'Leg Press' },
    { label: 'Bicep Curls', value: 'Bicep Curls' },
    { label: 'Tricep Extensions', value: 'Tricep Extensions' },
    { label: 'Shoulder Press', value: 'Shoulder Press' },
    { label: 'Dumbbell Lunges', value: 'Dumbbell Lunges' },
    { label: 'Chest Fly Machine', value: 'Chest Fly Machine' },
    { label: 'Lat Pulldowns', value: 'Lat Pulldowns' },
    { label: 'Seated Cable Row', value: 'Seated Cable Row' },
    { label: 'Leg Curl Machine', value: 'Leg Curl Machine' },
    { label: 'Leg Extension Machine', value: 'Leg Extension Machine' },
    { label: 'Cable Bicep Curl', value: 'Cable Bicep Curl' },
    { label: 'Cable Tricep Down', value: 'Cable Tricep Down' },
    { label: 'Smith Machine Exercises', value: 'Smith Machine Exercises' },
    { label: 'Dumbbell Rows', value: 'Dumbbell Rows' },
    { label: 'Incline Bench Press', value: 'Incline Bench Press' },
    { label: 'Decline Bench Press', value: 'Decline Bench Press' },
    { label: 'Dumbbell Flyes', value: 'Dumbbell Flyes' },
  ];

  const weightOptions = [...Array(201).keys()]
  .filter(k => k % 5 === 0 && k !== 0)
  .map(k => ({ label: `${k} kg`, value: k }));


  const repOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(num => ({ label: `${num} reps`, value: num }));
  const setOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({ label: `${num} sets`, value: num }));
  return (
    <View className="flex items-center pt-5 gap-3">
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        placeholder="Exercise Name"
        value={exerciseName}
        onChange={(item) => setExerciseName(item.value)}
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholderText}
      />
      <Dropdown
        mode="default"
        data={weightOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Weight"
        value={exerciseWeight}
        onChange={(item) => setExerciseWeight(item)}
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholderText}
      />
      <Dropdown
      mode="default"
      data={repOptions}
      labelField="label"
      valueField="value"
      placeholder="Select Rep Count"
      value={repOptions.find(option => option.value === exerciseReps) || null}
      onChange={(item) => setExerciseReps(item.value)}
      style={styles.dropdown}
      selectedTextStyle={styles.selectedText}
      placeholderStyle={styles.placeholderText}
      />
      <Dropdown
      mode="default"
      data={setOptions}
      labelField="label"
      valueField="value"
      placeholder="Set Count"
      value={repOptions.find(option => option.value === exerciseSets) || null}
      onChange={(item) => setExerciseSets(item.value)}
      style={styles.dropdown}
      selectedTextStyle={styles.selectedText}
      placeholderStyle={styles.placeholderText}
    />

      <TouchableOpacity
          onPress={() => addAnExercise()}
          className='px-4 py-2 bg-blue-500 rounded-xl w-[85%] mt-4'
          >
          <Text className='text-white text-[20px] font-medium text-center'>Add Exercise</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 50, // Adjust the height as needed
    width: '90%',
  },
  selectedText: {
    fontSize: 16,
    color: 'black',
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default GymExercise
