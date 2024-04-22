import {useCallback, useEffect, useState} from "react"
import {Alert, FlatList, Image, Pressable, TouchableOpacity, View} from "react-native"
import {Exercise} from "../../types/DBTypes"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useUserContext} from "../../hooks/ContextHooks";
import {useExercise, useWorkouts} from "../../hooks/apiHooks";
import {Text} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../types/LocalTypes";
import BenchPressImage from '../../assets/images/cardio-exercise.jpg'
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";


type ExerciseImageMap = {
  [key: string]: any;
}


const exerciseImages: ExerciseImageMap = {
  'Bench Press': require('../../assets/images/bench-press.jpg'),
  'Squat Rack Squats': require('../../assets/images/squat-rack.jpg'),
  'Deadlift': require('../../assets/images/deadlift.jpg'),
  'Leg Press': require('../../assets/images/legpress.jpg'),
  'Bicep Curls': require('../../assets/images/bicep-curl.jpg'),
  'Tricep Extensions': require('../../assets/images/tricep-ext.jpg'),
  'Shoulder Press': require('../../assets/images/shoulder-press.jpg'),
  'Dumbbell Lunges': require('../../assets/images/dlunges.jpg'),
  'Chest Fly Machine': require('../../assets/images/cfmachine.jpg'),
  'Lat Pulldowns': require('../../assets/images/latpulldown.jpg'),
  'Seated Cable Row': require('../../assets/images/seated-cable-row.jpg'),
  'Leg Curl Machine': require('../../assets/images/leg-curl-machine.jpg'),
  'Leg Extension Machine': require('../../assets/images/leg-extension.jpg'),
  'Cable Bicep Curl': require('../../assets/images/cable-curls.png'),
}

exerciseImages['default'] = require('../../assets/images/gym-exercise-2.jpg');


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

  const renderRightActions = (exerciseId: number) => (progress, dragX) => {
    return (
      <TouchableOpacity
        className="w-[105px] h-[88%] bg-red-500 items-center justify-center rounded-r-xl"
        onPress={() => ExerciseWarning(exerciseId)}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Delete</Text>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      getWorkoutStatusByWorkoutId();
      getExercisesByWorkoutId();
    }, [])
  );



  return (
    <GestureHandlerRootView className="px-4 pb-2 h-[92%]">
      <View className="w-full py-[2px] bg-[#efeeee] border border-gray-50 mb-[12px] shadow-sm shadow-black rounded-[8px]">
        <Text className="w-full text-center justify-center  text-[22px] py-[3px] font-medium text-[#2A2A2A]">Exercises</Text>
      </View>
      {userExercises && userExercises.length > 0 ? (
        <FlatList
          data={userExercises}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={renderRightActions(item.exercise_id)}>
              <Pressable
                onPress={() => {
                  navigation.navigate('ExerciseInfoScreen', { exerciseId: item.exercise_id, refresh: true  })
                }}
              >
                <View className="bg-white  mb-4 rounded-lg shadow relative overflow-hidden min-h-[140px]">
                  {!isLoading && !workoutStatus && (

                    <TouchableOpacity className="absolute -top-2 right-2 p-2 z-10 h-full justify-center">
                  </TouchableOpacity>
                  )}
                  <Image
                    source={exerciseImages[item.exercise_name] || exerciseImages['default']}
                    className="absolute w-[169px] h-full top-0 right-0 "
                    resizeMode="cover"
                  />
                  <View className="absolute -bottom-24 -right-20 bg-white h-[99%] w-[100%] transform rotate-45 translate-x-1/2 -translate-y-1/2 z-[2]" />
                  {item.exercise_duration === 0 && item.exercise_distance === 0 && item.exercise_weight > 0 ? (
                    // Gym
                    <View className="py-3 pl-5 z-10">
                      <Text className="text-lg font-bold text-gray-800 mb-1">{item.exercise_name}</Text>
                      <Text className="text-base text-gray-600 mb-0.5">{item.exercise_weight} kg</Text>
                      <Text className="text-base text-gray-600 mb-0.5">{item.exercise_reps} rep</Text>
                      <Text className="text-base text-gray-600 mb-2">{item.exercise_sets} sets</Text>
                    </View>
                  ) : item.exercise_weight === 0 && item.exercise_distance === 0 && item.exercise_duration > 0 ? (
                    // Body weight with duration
                    <View className="py-3 pl-5 z-10">
                      <Text className="text-lg font-bold text-gray-800 mb-1">{item.exercise_name}</Text>
                      <Text className="text-base text-gray-600 mb-1">Duration: {item.exercise_duration}</Text>
                    </View>
                  ) : item.exercise_weight === 0 && (item.exercise_distance !== 0 || item.exercise_duration > 0) ? (
                    // Cardio
                    <View className="py-3 pl-5 z-10">

                      <Text className="text-lg font-bold text-gray-800 mb-1">{item.exercise_name}</Text>
                      <Text className="text-base text-gray-600 mb-1">{item.exercise_distance} km</Text>
                      <Text className="text-base text-gray-600 mb-1">{item.exercise_duration} minutes</Text>
                    </View>
                  ) : (
                    // Body weight with reps
                    <View className="py-3 pl-5 z-10">
                      <Text className="text-lg font-bold text-gray-800 mb-1">{item.exercise_name}</Text>
                      <Text className="text-base text-gray-600 mb-0.5">Reps: {item.exercise_reps}</Text>
                      <Text className="text-base text-gray-600 mb-1">Sets: {item.exercise_sets}</Text>
                    </View>
                  )}
                </View>
                </Pressable>
              </Swipeable>
          )}

        />
        ) : (
            <View className="items-center">
                <Text className="text-lg text-gray-500 pt-40 ">No Exercises added.</Text>
            </View>
        )}
    </GestureHandlerRootView>
  )
}

export default Exercises
