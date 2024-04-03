import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { UserWorkout } from "../types/DBTypes"
import { ExerciseProps, RootStackParamList } from "../types/LocalTypes"
import { useUserContext } from "../hooks/ContextHooks";
import { useExcersise } from "../hooks/apiHooks";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";

const BodyWeightExercise = ({ workout, workoutId }: ExerciseProps) => {
  const { user } = useUserContext();
  const { addExercise } = useExcersise();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseReps, setExerciseReps] = useState<number | null>(null);
  const [exerciseSets, setExerciseSets] = useState<number | null>(null);
  const [exerciseDuration, setExerciseDuration] = useState<number | null>(null);
  const [isDurationBased, setIsDurationBased] = useState(false);


  const addAnExercise = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const exerciseDurationValue = exerciseDuration ? exerciseDuration : 0;
      const exerciseRepsValue = exerciseReps !== null ? exerciseReps : 0;
      const exerciseSetsValue = exerciseSets !== null ? exerciseSets : 0;

      const exercises = {
        user_id: user.user_id,
        user_workout_id: workoutId,
        exercise_weight: 0,
        exercise_name: exerciseName,
        exercise_duration: exerciseDurationValue,
        exercise_reps: exerciseRepsValue,
        exercise_sets: exerciseSetsValue,
        exercise_distance: 0,
      };

      await addExercise(user.user_id, exercises, token);

      setExerciseName('');
      setExerciseReps(null);
      setExerciseDuration(null);

      navigation.navigate('WorkoutDetails', { workoutId: workoutId, refresh: true });
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  const options = [
    { label: 'Push-Ups', value: 'Push-Ups', isDurationBased: false },
    { label: 'Squats', value: 'Squats', isDurationBased: false },
    { label: 'Lunges', value: 'Lunges', isDurationBased: false },
    { label: 'Plank', value: 'Plank', isDurationBased: true },
    { label: 'Side Plank', value: 'Side Plank', isDurationBased: true },
    { label: 'Sit-Ups', value: 'Sit-Ups', isDurationBased: false },
    { label: 'Glute Bridge', value: 'Glute Bridge', isDurationBased: false },
    { label: 'Leg Raises', value: 'Leg Raises', isDurationBased: false },
    { label: 'Burpees', value: 'Burpees', isDurationBased: false },
    { label: 'Mountain Climbers', value: 'Mountain Climbers', isDurationBased: false },
    { label: 'Dips', value: 'Dips', isDurationBased: false },
    { label: 'Wall Sit', value: 'Wall Sit', isDurationBased: true },
  ];

  const weightOptions = [...Array(201).keys()]
  .filter(k => k % 5 === 0 && k !== 0)
  .map(k => ({ label: `${k} kg`, value: k }));


  const repOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(num => ({ label: `${num} reps`, value: num }));
  const setOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({ label: `${num} sets`, value: num }));


  const durationOptions = [30, 45, 60, 90, 120, 150, 180].map(sec => ({ label: `${sec} seconds`, value: sec }));

  return (
    <View className="flex items-center pt-5 ">
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        placeholder="Exercise Name"
        value={exerciseName}
        onChange={(item) => {
          setExerciseName(item.value)
          setIsDurationBased(item.isDurationBased || false);
        }}
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholderText}
      />
      <View className=" flex w-full items-center">
        {isDurationBased ? (
          <Dropdown
            mode="default"
            data={durationOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Duration"
            value={durationOptions.find(option => option.value === exerciseDuration) || null}
            onChange={(item) => setExerciseDuration(item.value)}
            style={styles.dropdown}
            selectedTextStyle={styles.selectedText}
            placeholderStyle={styles.placeholderText}
          />
        ) : (
          <>
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
            </>

        )}
      </View>

      <TouchableOpacity
          onPress={() => addAnExercise()}
          className='px-4 py-2 bg-blue-500 rounded-xl w-[85%] mt-2'
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
    marginBottom: 10,
    height: 50,
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

export default BodyWeightExercise
