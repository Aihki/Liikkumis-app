import { Text, TouchableOpacity, View, StyleSheet, TextInput } from "react-native"
import { UserWorkout } from "../types/DBTypes"
import { ExerciseProps, RootStackParamList } from "../types/LocalTypes"
import { useUserContext } from "../hooks/ContextHooks";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import { useExercise } from "../hooks/apiHooks";

const CardioExercise = ({ workout, workoutId }: ExerciseProps) => {
  const { user } = useUserContext();
  const { addExercise } = useExercise();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseDuration, setExerciseDuration] = useState<number | null>(null);
  const [exerciseDistance, setExerciseDistance] = useState<number | null>(null);
  const [isDurationBased, setIsDurationBased] = useState(false);
  const [isDistanceBased, setIsDistanceBased] = useState(false);
  const [customExercise, setCustomExercise] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const addAnExercise = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const exerciseDurationValue = exerciseDuration ? exerciseDuration : 0;
      const exerciseDistanceValue = exerciseDistance !== null ? exerciseDistance : 0;


      const exercises = {
        user_id: user.user_id,
        user_workout_id: workoutId,
        exercise_weight: 0,
        exercise_name: exerciseName,
        exercise_duration: exerciseDurationValue,
        exercise_reps: 0,
        exercise_sets: 0,
        exercise_distance: exerciseDistanceValue,
      };

      await addExercise(user.user_id, exercises, token);

      setExerciseName('');
      setExerciseDuration(null);
      setExerciseDistance(null);

      navigation.navigate('WorkoutDetails', { workoutId: workoutId, refresh: true });
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  const options = [
    { label: 'Add Custom Exercise...', value: 'custom' },
    { label: 'Running', value: 'Running', isDistanceBased: true },
    { label: 'Cycling', value: 'Cycling', isDistanceBased: true },
    { label: 'Swimming', value: 'Swimming', isDistanceBased: false },
    { label: 'Rowing', value: 'Rowing', isDistanceBased: true },
    { label: 'High-Intensity Interval Training (HIIT)', value: 'HIIT', isDistanceBased: false },
    { label: 'Boxing', value: 'Boxing', isDistanceBased: false },
    { label: 'Dancing', value: 'Dancing', isDistanceBased: false },
  ];


  const durationOptions = [30, 45, 60, 90, 120, 150, 180].map(sec => ({ label: `${sec} minutes`, value: sec }));
  const distanceOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(km => ({ label: `${km} km`, value: km }));

  return (
    <View className="flex items-center pt-5">
      {!showCustomInput ? (
        <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        placeholder="Exercise Name"
        value={exerciseName}
        onChange={(item) => {
          if (item.value === 'custom') {
            setShowCustomInput(true);
          } else {
            setShowCustomInput(false);
            setExerciseName(item.value)
            setIsDistanceBased(item.isDistanceBased || false);
          }
        }}
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholderText}
      />
      ) : null}
      {showCustomInput ? (
        <>
          <TextInput
            placeholder="Enter Custom Exercise Name"
            style={styles.customExerciseInput}
            value={customExercise}
            onChangeText={(text) => {
              setCustomExercise(text);
              setExerciseName(text);
              }}
          />
          <TouchableOpacity
            style={{ position: 'absolute',top: 35, right: 31}}
            onPress={() => {
              setShowCustomInput(!showCustomInput)
            }}
          >
            <FontAwesome
                name="angle-down"
                size={20}
                color="gray"
            />
          </TouchableOpacity>
        </>
      ) : null}
      {isDistanceBased ? (
        <View className="flex items-center w-full gap-3 pt-3">
          <Dropdown
            mode="default"
            data={distanceOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Distance"
            value={distanceOptions.find(option => option.value === exerciseDistance) || null} // Ensure the entire object or null is passed
            onChange={(item) => setExerciseDistance(item.value)}
            style={styles.dropdown}
            selectedTextStyle={styles.selectedText}
            placeholderStyle={styles.placeholderText}
          />
          <Dropdown
            mode="default"
            data={durationOptions}
            labelField="label"
            valueField="value"
            placeholder="Exercise Duration"
            value={durationOptions.find(option => option.value === exerciseDuration) || null} // This is correct
            onChange={(item) => setExerciseDuration(item.value)}
            style={styles.dropdown}
            selectedTextStyle={styles.selectedText}
            placeholderStyle={styles.placeholderText}
          />
        </View>
      ) : (
        <View className="pt-3 w-full items-center">
          <Dropdown
              mode="default"
              data={durationOptions}
              labelField="label"
              valueField="value"
              placeholder="Exercise Duration"
              value={durationOptions.find(option => option.value === exerciseDuration) || null}
              onChange={(item) => setExerciseDuration(item.value)}
              style={styles.dropdown}
              selectedTextStyle={styles.selectedText}
              placeholderStyle={styles.placeholderText}
            />
        </View>
      )}

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
  customExerciseInput: {
    position: 'relative',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 2,
    height: 50,
    width: '90%',
    fontSize: 16,
  },
});

export default CardioExercise
