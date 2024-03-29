import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../types/LocalTypes";
import {useUserContext} from "../hooks/ContextHooks";
import {useExcersise} from "../hooks/apiHooks";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Text, View, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const AddExerciseScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'WorkoutDetails'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { workoutId } = route.params;
  const { user } = useUserContext();
  const { addExercise, getDefailtExercises } = useExcersise();

  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseWeight, setExerciseWeight] = useState<number>(0);
  const [exerciseReps, setExerciseReps] = useState<number>(0);
  const [defaultExercises, setDefaultExercises] = useState<string[]>([]);
  const [isPickerShow, setIsPickerShow] = useState<boolean>(false);



  const weightOptions = [...Array(201).keys()].filter(k => k % 5 === 0 && k !== 0);

  const repOptions = [...Array(26).keys()].filter(k => k !== 0);

  const getDExercises = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!user || !token) return;
    try {
      const exercises = await getDefailtExercises();
      setDefaultExercises(exercises.map(ex => ex.exercise_name));
    } catch (error) {
      console.error(error);
    }
  };


  const addAnExercise = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const exercises = {
        user_id: user.user_id,
        user_workout_id: workoutId,
        exercise_name: exerciseName,
        exercise_weight: exerciseWeight,
        exercise_reps: exerciseReps,
      };
      await addExercise(user.user_id, exercises, token);
      setExerciseName('');
      setExerciseWeight(0);
      setExerciseReps(0);
      navigation.navigate('WorkoutDetails', { workoutId: workoutId, refresh: true });
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  useEffect(() => {
    getDExercises();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Add Exercise</Text>
        <TextInput
          placeholder="Exercise Name"
          value={exerciseName}
          onChangeText={setExerciseName}
          onFocus={() => setIsPickerShow(true)}
          onBlur={() => setIsPickerShow(false)}
          style={styles.input}
        />
        {isPickerShow && (
          <Picker
            selectedValue={exerciseName}
            onValueChange={(itemValue, itemIndex) => setExerciseName(itemValue)}
            style={styles.picker}
          >
            {defaultExercises.map((name, index) => (
              <Picker.Item label={name} value={name} key={index} />
            ))}
          </Picker>
        )}
        <Text>Exercise Weight</Text>
        <Picker
          selectedValue={exerciseWeight}
          onValueChange={(itemValue, itemIndex) =>
            setExerciseWeight(itemValue)
          }
          style={{ height: 50, width: '90%'}}
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
          style={{ height: 50, width: '90%' }}
        >
          {repOptions.map((rep) => (
            <Picker.Item label={`${rep}`} value={rep} key={rep} />
          ))}
        </Picker>
        <TouchableOpacity
          onPress={() => addAnExercise()}
          className='px-4 py-2 bg-blue-500 rounded-xl w-[85%] mt-4'
          >
          <Text className='text-white text-[20px] font-medium text-center'>Add Exercise</Text>
      </TouchableOpacity>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25,
    alignItems: 'center',

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '90%',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 15,
  },
  // Add more styles as needed
});

export default AddExerciseScreen
