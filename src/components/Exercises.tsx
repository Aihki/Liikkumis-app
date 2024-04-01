import {useCallback, useEffect, useState} from "react"
import {Alert, FlatList, TouchableOpacity, View} from "react-native"
import {Exercise} from "../types/DBTypes"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useUserContext} from "../hooks/ContextHooks";
import {useExcersise} from "../hooks/apiHooks";
import {Text} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../types/LocalTypes";

type AddExerciseProps =  {
  workoutId: number;
}

const Exercises: React.FC<AddExerciseProps> = ({ workoutId }) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userExercises, setuserExercises] = useState<Exercise[] | []>([]);
  const { user } = useUserContext();
  const { getUsersExcersisesByWorkoutId, deleteExercise } = useExcersise();

  const getExercisesByWorkoutId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;

    try {
      const exercisesResponse = await getUsersExcersisesByWorkoutId(user.user_id, workoutId, token);
      console.log(exercisesResponse);
      if (exercisesResponse) {
        const processedExercises = exercisesResponse.map(exercise => ({
          ...exercise,
          exercise_distance: exercise.exercise_distance.toString(),
          created_at: new Date(exercise.created_at),
        }));
        setuserExercises(processedExercises);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExerciseWhithEId = async (userId: number, exerciseId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      await deleteExercise(user?.user_id, exerciseId, token);
      getExercisesByWorkoutId();
    } catch (error) {
      console.error(error);
    }
  };

  const ExerciseWarning = async (exerciseId: number) => {
    if (!user) return;
    Alert.alert("Delete Exercise", "Are you sure you want to delete this exercise?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => deleteExerciseWhithEId(user?.user_id, exerciseId)},
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      getExercisesByWorkoutId();
    }, [])
  );


  return (
    <View className="px-4 pb-2 h-[92%]">
      <Text className="w-full text-center  text-[22px] pb-3">Exercises</Text>
      {userExercises && userExercises.length > 0 ? (
        <FlatList
          data={userExercises}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditExerciseScreen', { exerciseId: item.exercise_id, refresh: true  })
              }}
            >
              <View className="bg-white p-4 mb-4 rounded-lg shadow">
                <TouchableOpacity className="absolute top-5 right-4 p-2 z-10">
                  <FontAwesome
                    name="trash"
                    size={22}
                    color="black"
                    onPress={() => ExerciseWarning(item.exercise_id)}
                  />
                </TouchableOpacity>
                {item.exercise_duration === 0 && item.exercise_distance === '0.00' && item.exercise_weight > 0 ? (
                  // Gym
                  <>
                    <Text>Gym</Text>
                    <Text>{item.exercise_name}</Text>
                    <Text>{item.exercise_weight} lbs</Text>
                    <Text>{item.exercise_reps} reps</Text>
                  </>
                ) : item.exercise_weight === 0 && item.exercise_distance === '0.00' && item.exercise_duration > 0 ? (
                  // Body weight with duration
                  <>
                    <Text>{item.exercise_name}</Text>
                    <Text>Duration: {item.exercise_duration} seconds</Text>
                  </>
                ) : item.exercise_weight === 0 && (item.exercise_distance !== '0.00' || item.exercise_duration > 0) ? (
                  // Cardio
                  <>
                    <Text>{item.exercise_name}</Text>
                    <Text>{item.exercise_distance} km</Text>
                    <Text>{item.exercise_duration} minutes</Text>
                  </>
                ) : (
                  // Body weight with reps
                  <>
                    <Text>{item.exercise_name}</Text>
                    <Text>Reps: {item.exercise_reps}</Text>
                  </>
                )
                }

              </View>
            </TouchableOpacity>
          )}
        />
        ) : (
            <View className="items-center">
                <Text className="text-lg text-gray-500 pt-5 ">No Exercises added.</Text>
            </View>
        )}
    </View>
  )
}

export default Exercises
