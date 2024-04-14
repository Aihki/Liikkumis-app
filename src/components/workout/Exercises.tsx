import {useCallback, useEffect, useState} from "react"
import {Alert, FlatList, TouchableOpacity, View} from "react-native"
import {Exercise} from "../../types/DBTypes"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useUserContext} from "../../hooks/ContextHooks";
import {useExercise, useWorkouts} from "../../hooks/apiHooks";
import {Text} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../types/LocalTypes";


type AddExerciseProps =  {
  workoutId: number;
}

const Exercises: React.FC<AddExerciseProps> = ({ workoutId }) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userExercises, setuserExercises] = useState<Exercise[] | []>([]);
  const [workoutStatus, setWorkoutStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUserContext();
  const { getUsersExercisesByWorkoutId, deleteExercise } = useExercise();
  const { getWorkoutStatus } = useWorkouts();


  const getExercisesByWorkoutId = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;

    try {
      const exercisesResponse = await getUsersExercisesByWorkoutId(user.user_id, workoutId, token);
      if (exercisesResponse) {
        const processedExercises = exercisesResponse.map(exercise => ({
          ...exercise,
          exercise_distance: exercise.exercise_distance,
          created_at: new Date(exercise.created_at),
        }));
        setuserExercises(processedExercises);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWorkoutStatusByWorkoutId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;

    try {
      const workoutStatus = await getWorkoutStatus(user.user_id, workoutId, token);
      setWorkoutStatus(workoutStatus.workoutCompleted);
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
      getWorkoutStatusByWorkoutId();
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
                navigation.navigate('ExerciseInfoScreen', { exerciseId: item.exercise_id, refresh: true  })
              }}
            >
              <View className="bg-white p-4 mb-4 rounded-lg shadow">
                {!isLoading && !workoutStatus && (
                  <TouchableOpacity className="absolute -top-2 right-2 p-2 z-10 h-full justify-center">
                  <FontAwesome
                    name="times"
                    size={18}
                    color="black"
                    onPress={() => ExerciseWarning(item.exercise_id)}
                  />
                </TouchableOpacity>
                )}

                {item.exercise_duration === 0 && item.exercise_distance === 0 && item.exercise_weight > 0 ? (
                  // Gym
                  <>
                    <Text className="text-lg font-bold text-gray-800 mb-1">{item.exercise_name}</Text>
                    <Text className="text-base text-gray-600 mb-0.5">{item.exercise_weight} kg</Text>
                    <Text className="text-base text-gray-600 mb-0.5">{item.exercise_reps} rep</Text>
                    <Text className="text-base text-gray-600 mb-2">{item.exercise_sets} sets</Text>
                  </>
                ) : item.exercise_weight === 0 && item.exercise_distance === 0 && item.exercise_duration > 0 ? (
                  // Body weight with duration
                  <>
                    <Text className="text-lg font-bold text-gray-800 mb-1">{item.exercise_name}</Text>
                    <Text className="text-base text-gray-600 mb-1">Duration: {item.exercise_duration}</Text>
                  </>
                ) : item.exercise_weight === 0 && (item.exercise_distance !== 0 || item.exercise_duration > 0) ? (
                  // Cardio
                  <>

                    <Text className="text-lg font-bold text-gray-800 mb-1">{item.exercise_name}</Text>
                    <Text className="text-base text-gray-600 mb-1">{item.exercise_distance} km</Text>
                    <Text className="text-base text-gray-600 mb-1">{item.exercise_duration} minutes</Text>
                  </>
                ) : (
                  // Body weight with reps
                  <>
                    <Text className="text-lg font-bold text-gray-800 mb-1">{item.exercise_name}</Text>
                    <Text className="text-base text-gray-600 mb-0.5">Reps: {item.exercise_reps}</Text>
                    <Text className="text-base text-gray-600 mb-1">Sets: {item.exercise_sets}</Text>
                  </>
                )}

              </View>
            </TouchableOpacity>
          )}
        />
        ) : (
            <View className="items-center">
                <Text className="text-lg text-gray-500 pt-40 ">No Exercises added.</Text>
            </View>
        )}
    </View>
  )
}

export default Exercises
