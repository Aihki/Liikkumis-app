import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/LocalTypes";
import Exercises from "./Exercises";
import {Text, TouchableOpacity, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useWorkouts} from "../hooks/apiHooks";
import {useUserContext} from "../hooks/ContextHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserWorkout} from "../types/DBTypes";
import {useEffect, useState} from "react";




const WorkoutDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'WorkoutDetails'>>();
  const { workoutId } = route.params;
  const { user } = useUserContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { getUserWorkoutByWorkoutId } = useWorkouts();
  const [workoutInfo, setWorkoutInfo] = useState<UserWorkout | null>(null);


  const getWorkout = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const workout = await getUserWorkoutByWorkoutId(user.user_id, workoutId, token);
      setWorkoutInfo(workout);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToEditWorkout = () => {
    navigation.navigate('EditWorkoutScreen', { workoutId: workoutId })
  };

  useEffect(() => {
    getWorkout();
  }, []);

  useEffect(() => {
    if (workoutInfo) {
      navigation.setOptions({ title: workoutInfo.workout_name });
    }
  }, [workoutInfo, navigation]);

return (
    <>
      {workoutInfo ? (
        <>
          <View>
            <View className="p-5 bg-white rounded-xl shadow-md">
              <Text className="text-xl font-bold">{workoutInfo.workout_name}</Text>
              <Text className="text-gray-700">{workoutInfo.workout_description}</Text>
              <Text className="text-gray-500">{new Date(workoutInfo.workout_date).toLocaleDateString()}</Text>
              <TouchableOpacity
                onPress={navigateToEditWorkout}
                className="mt-2 py-2 px-4 border border-blue-500 bg-white rounded-lg"
              >
              <Text className="text-blue-500 text-center">Edit Workout</Text>
              </TouchableOpacity>
              </View>
            <View className="w-full  relative h-[75%] pt-4">
            <Exercises workoutId={workoutId} />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddExerciseScreen', { workoutId: workoutId, workoutInfo: workoutInfo, refresh: true  })}
              className=' absolute z-10 bottom-0 left-[7%] px-4 py-2 bg-blue-500 rounded-xl w-[85%]'
            >
            <Text className='text-white text-[20px] font-medium text-center'>Add Exercise</Text>
            </TouchableOpacity>

          </View>
        </>
      ) : (
        <Text className="text-center text-xl">Loading workout...</Text>
      )}

    </>
  )
}

export default WorkoutDetails
