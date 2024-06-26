import { Text, TextInput, TouchableOpacity, View, StyleSheet, Keyboard } from "react-native"
import { CombinedChallenge, UserWorkout } from "../../types/DBTypes"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../../hooks/ContextHooks";
import { useEffect, useState } from "react";
import { ExerciseProps, RootStackParamList } from "../../types/LocalTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";
import { useChallenge, useExercise } from "../../hooks/apiHooks";
import { TouchableWithoutFeedback } from "react-native";


const GymExercise = ({ workout, workoutId }: ExerciseProps) => {
  const { user } = useUserContext();
  const { addExercise } = useExercise();
  const { getChallengeByUserId, updateChallengeProgress } = useChallenge();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseWeight, setExerciseWeight] = useState<{ label: string; value: number; } | null>(null);
  const [exerciseReps, setExerciseReps] = useState<number | null>(null);
  const [exerciseSets, setExerciseSets] = useState<number | null>(null);
  const [customExercise, setCustomExercise] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<CombinedChallenge[]>([]);

  const getChallengesByUId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user?.user_id) return;
    try {
      const response = await getChallengeByUserId(user.user_id);
      setChallenges(response);
    } catch (error) {
      console.error("Failed to fetch challenges:", error);
    }
  };

  useEffect(() => { getChallengesByUId()}, [])

  const addAnExercise = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
        const exerciseWeightValue = exerciseWeight ? exerciseWeight.value : 0;
        const exerciseRepsValue = exerciseReps !== null ? exerciseReps : 0;
        const exerciseSetsValue = exerciseSets !== null ? exerciseSets : 0;

        // Adding the exercise to the database
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

        // Update challenges if there are any reps done
        if (exerciseRepsValue > 0) {
            console.log(challenges);
            const relevantChallenges = challenges.filter(challenge =>
                challenge.target_type === 'Repetition'
            );
            relevantChallenges.forEach(async (challenge) => {
                const totalReps = exerciseRepsValue * exerciseSetsValue;
                await updateChallengeProgress(challenge.challenge_id, user.user_id, totalReps, token);
            });
        }

        // Reset fields after submission
        setExerciseName('');
        setCustomExercise('');
        setExerciseWeight(null);
        setExerciseReps(null);
        setExerciseSets(null);

        // Navigate back to workout details
        navigation.navigate('WorkoutDetails', { workoutId: workoutId, refresh: true });
    } catch (error) {
        console.error("Failed to add exercise:", error);
    }
  };


  const options = [
    { label: 'Add Custom Exercise...', value: 'custom' },
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex items-center pt-5 gap-3 h-[100%]">
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
              setExerciseName(item.value);
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
              style={{ position: 'absolute',top: 45, right: 30}}
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
            className='px-4 py-2 bg-indigo-500 rounded-md w-[91%]'
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
    marginLeft: 11,
    height: 50,
    width: '90%',
    fontSize: 16,
    marginTop: 12,
  },
});

export default GymExercise
