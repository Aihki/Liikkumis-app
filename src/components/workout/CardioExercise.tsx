import { Text, TouchableOpacity, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Challenge, CombinedChallenge, UserChallenge, UserWorkout } from "../../types/DBTypes"
import { ExerciseProps, RootStackParamList } from "../../types/LocalTypes"
import { useUserContext } from "../../hooks/ContextHooks";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import { useChallenge, useExercise } from "../../hooks/apiHooks";



const CardioExercise = ({ workout, workoutId }: ExerciseProps) => {
  const { user } = useUserContext();
  const { addExercise } = useExercise();
  const { getChallengeByUserId, updateChallengeProgress } = useChallenge();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseDuration, setExerciseDuration] = useState<number | null>(null);
  const [exerciseDistance, setExerciseDistance] = useState<number | null>(null);
  const [isDurationBased, setIsDurationBased] = useState(false);
  const [isDistanceBased, setIsDistanceBased] = useState(false);
  const [customExercise, setCustomExercise] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<CombinedChallenge[]>([]);

  const getChallengesByUId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user?.user_id) return;
    try {
      const response = await getChallengeByUserId(user.user_id);
      console.log(response);

      setChallenges(response);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    }
  };

  const updateProgress = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user || exerciseDistance === null) return;

    try {
        const runningChallenges = challenges.filter(challenge =>
            challenge.challenge_name.toLowerCase().includes('running')
        );

        if (runningChallenges.length === 0) {
            console.log("No running challenges found.");
            return;
        }

        const updatePromises = runningChallenges.map(challenge =>
            updateChallengeProgress(challenge.challenge_id, user.user_id, exerciseDistance, token)
        );

        const results = await Promise.all(updatePromises);
        console.log("Update results:", results);
    } catch (error) {
        console.error("Failed to update progress:", error);
    }
};


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

      if (isDistanceBased && exerciseName.toLowerCase() === 'running') {
        updateProgress();
    };

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
    { label: 'Swimming', value: 'Swimming', isDistanceBased: true },
    { label: 'Rowing', value: 'Rowing', isDistanceBased: true },
  ];


  const durationOptions = [30, 45, 60, 90, 120, 150, 180, 200, 220, 250].map(sec => ({ label: `${sec} minutes`, value: sec }));
  const distanceOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50].map(km => ({ label: `${km} km`, value: km }));

  useFocusEffect(
    useCallback(() => {
      getChallengesByUId();
      return () => {};
    }, [user?.user_id])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex items-center pt-5 h-[100%]">
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
            className='px-4 py-2 bg-indigo-500 rounded-md w-[91%] mt-3'
            >
            <Text className='text-white text-[20px] font-medium text-center'>Add Exercise</Text>
          </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
