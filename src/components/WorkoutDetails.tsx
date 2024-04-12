import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/LocalTypes";
import Exercises from "./Exercises";
import {Alert, Pressable, Text, TouchableOpacity, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useWorkouts} from "../hooks/apiHooks";
import {useUserContext} from "../hooks/ContextHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserWorkout} from "../types/DBTypes";
import {useEffect, useRef, useState} from "react";
import LottieView from 'lottie-react-native';



const WorkoutDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'WorkoutDetails'>>();
  const { workoutId } = route.params;
  const { user } = useUserContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { getUserWorkoutByWorkoutId } = useWorkouts();
  const [workoutInfo, setWorkoutInfo] = useState<UserWorkout | null>(null);
  const [checked , setChecked] = useState(false);

  const { setWorkoutStatusToCompleted } = useWorkouts();

  const navigateToEditWorkout = () => {
    navigation.navigate('EditWorkoutScreen', { workoutId });
  };

  const getWorkout = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const workout = await getUserWorkoutByWorkoutId(user.user_id, workoutId, token);
      setWorkoutInfo(workout);
      setChecked(workout.workout_status === 'completed');
    } catch (error) {
      console.error(error);
    }
  };

  const setWorkoutStatusToC = async (workoutId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      await setWorkoutStatusToCompleted(workoutId, token);
    } catch (error) {
      console.error(error);
    }
  }


  const checkmRef = useRef<LottieView | null>(null);

  const handleCheckMark = () => {
    if (checked) {
      Alert.alert(
        "Workout Already Completed",
        "This workout has already been marked as completed.",
        [
          { text: "OK" }
        ]
      );
    } else {
      Alert.alert(
        "Mark as Completed",
        "Are you sure you want to mark this workout as completed?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              try {
                await setWorkoutStatusToC(workoutId);
                setChecked(true);
                if (checkmRef.current) {
                  checkmRef.current.play(0, 100);
                }
                setTimeout(() => {
                  navigation.goBack();
                }, 1200);
              } catch (error) {
                console.error("Failed to update workout status: ", error);
              }
            },
          },
        ]
      );
    }
  };

  useEffect(() => {
    getWorkout();
  }, []);

  useEffect(() => {
    if (checkmRef.current && workoutInfo) {
      if (checked) {
        checkmRef.current.play(0, 100);
      } else {
        checkmRef.current.reset();
      }
    }
  }, [checked, workoutInfo]);

return (
    <>
      {workoutInfo ? (
        <>
          <View>
            <View className="p-5 bg-white rounded-xl shadow-md relative">
              <Text className="text-xl font-bold">{workoutInfo.workout_name}</Text>
              <Text className="text-gray-700">{workoutInfo.workout_description}</Text>
              <Text className="text-gray-500">{new Date(workoutInfo.workout_date).toLocaleDateString()}</Text>
              <View className="absolute right-5">
                <Pressable onPress={handleCheckMark}>
                  <LottieView
                    source={require('../../assets/cmark3.json')}
                    ref={checkmRef}
                    loop={false}
                    style={{
                      width: 80,
                      height: 90,
                      backgroundColor: '#fff',

                    }}
                  />
                </Pressable>
              </View>
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
            {!checked &&
            (
              <TouchableOpacity
              onPress={() => navigation.navigate('AddExerciseScreen', { workoutId: workoutId, workoutInfo: workoutInfo, refresh: true  })}
              className=' absolute z-10 bottom-0 left-[7%] px-4 py-2 bg-blue-500 rounded-xl w-[85%]'
              >
                <Text className='text-white text-[20px] font-medium text-center'>Add Exercise</Text>
              </TouchableOpacity>
            )}


          </View>
        </>
      ) : (
        <Text className="text-center text-xl">Loading workout...</Text>
      )}

    </>
  )
}

export default WorkoutDetails
