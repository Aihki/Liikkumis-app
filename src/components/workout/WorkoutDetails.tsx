import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/LocalTypes";
import Exercises from "./Exercises";
import {Alert, Pressable, Text, TouchableOpacity, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useExercise, useWorkouts} from "../../hooks/apiHooks";
import {useUserContext} from "../../hooks/ContextHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Exercise, UserWorkout} from "../../types/DBTypes";
import React, {useEffect, useRef, useState} from "react";
import LottieView from 'lottie-react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { set } from "react-hook-form";



const WorkoutDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'WorkoutDetails'>>();
  const { workoutId } = route.params;
  const { user } = useUserContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { getUserWorkoutByWorkoutId, getCompletedExercisesCountWhitWorkoutId } = useWorkouts();
  const { getUsersExercisesByWorkoutId } = useExercise();
  const [workoutInfo, setWorkoutInfo] = useState<UserWorkout | null>(null);
  const [checked , setChecked] = useState(false);
  const [userExercises, setUserExercises] = useState<Exercise[]>([]);
  const [allExercisesCompleted, setAllExercisesCompleted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<{count: Number} | null>(null);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);

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

  const getExercisesByWorkoutId = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;

    try {
      const exercisesResponse = await getUsersExercisesByWorkoutId(user.user_id, workoutId, token);
      if (exercisesResponse) {
        let allCompleted = exercisesResponse.every(exercise => exercise.exercise_completed === 1);

        // Process and set the exercises
        const processedExercises = exercisesResponse.map(exercise => ({
          ...exercise,
          exercise_distance: exercise.exercise_distance,
          created_at: new Date(exercise.created_at),
          exercise_completed: exercise.exercise_completed ?? 0
        }));
        setUserExercises(processedExercises);
        setAllExercisesCompleted(allCompleted); // This should now reflect the actual completion status
      }
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

  const getCompletedExerciseCount = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const response = await getCompletedExercisesCountWhitWorkoutId(workoutId, user.user_id, token)
      console.log(response);
      setCompletedExercises(response)

    } catch (error) {

    }
  }

  const onExerciseCompleted = (exerciseId: number) => {
    const updatedExercises = userExercises.map(exercise => {
      if (exercise.exercise_id === exerciseId) {
        return { ...exercise, exercise_completed: 1 };
      }
      return exercise;
    });

    setUserExercises(updatedExercises);
    setAllExercisesCompleted(updatedExercises.every(ex => ex.exercise_completed === 1));
  };

  const onExerciseDeleted = (exerciseId: number) => {
    const updatedExercises = userExercises.filter(exercise => exercise.exercise_id !== exerciseId);
    setUserExercises(updatedExercises);
    setAllExercisesCompleted(updatedExercises.every(ex => ex.exercise_completed));
  };


  const checkmRef = useRef<LottieView | null>(null);

  const handleCheckMark = () => {
    if (userExercises.length === 0) {
      Alert.alert(
        "Empty Workout",
        "Can't complete an empty workout. Please add some exercises first.",
        [{ text: "OK" }]
      );
    } else if (!allExercisesCompleted) {
      Alert.alert(
        "Incomplete Workout",
        "All exercises must be completed before marking the workout as done.",
        [{ text: "OK" }]
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
                setShowCompletedMessage(true)
                setChecked(true);
              } catch (error) {
                console.error("Failed to update workout status: ", error);
              }
            },
          },
        ]
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await getWorkout();
        await getExercisesByWorkoutId();
        await getCompletedExerciseCount()
      };

      fetchData();

      return () => {


      };
    }, [user?.user_id, workoutId, showCompletedMessage])
  );

  useEffect(() => {
    if (checkmRef.current && workoutInfo) {
      if (checked) {
        checkmRef.current.play(0, 100);
      } else {
        checkmRef.current.reset();
      }
    }
  }, [checked, workoutInfo]);

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    date.setUTCDate(date.getUTCDate() + 1);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
      <>
        {workoutInfo ? (
          <>
            <View>
              <View className="px-2 pb-3 pt-2 bg-white border-b border-gray-200 shadow-lg relative w-full">
                <View className="border border-[#a5b4fc] rounded-md p-3 items-center relative">
                  <Text className="text-[24px] font-bold">{workoutInfo.workout_name}</Text>
                  <Text className=" text-[16px] text-gray-600">{truncateText(workoutInfo.workout_description, 42)}</Text>
                  <Text className="text-[16px] text-gray-500">{formatDate(workoutInfo.workout_date)}</Text>
                  <FontAwesome6
                    name="edit"
                    size={26}
                    color="black"
                    style={{position: 'absolute', right: 12, top: 8}}
                    onPress={navigateToEditWorkout}
                  />
                </View>

              </View>

              <View className="w-full  relative h-[80%]">
              <Exercises workoutId={workoutId} onExerciseCompleted={onExerciseCompleted} onExerciseDeleted={onExerciseDeleted} />
              </View>
              {workoutInfo.workout_status == 'completed' && showCompletedMessage ? (
                  <View className="relative">
                    <LottieView
                      source={require('../../assets/animations/trophy.json')}
                      autoPlay
                      loop={false}
                      style={{
                        width: 250,
                        height: 250,
                        position: 'absolute',
                        top: -606,
                        right: 76,
                        zIndex: 100
                      }}
                    />
                    <View className="bg-white border-[4px] border-yellow-500 z-100 px-5 py-9 pb-5 w-[85%]  absolute bottom-[125px] left-[8%] rounded-xl">
                      <Text className="text-center text-black font-bold text-[20px]">
                        Congratulations on completing your workout!
                      </Text>
                      <View className="bg-yellow-50 px-3 py-1 rounded-lg shadow-md mx-4 mt-7 border border-yellow-300">
                        <Text className="text-center text-gray-700 font-bold text-lg">
                          Workout Type: {workoutInfo.workout_type}
                        </Text>
                      </View>
                      <View className="bg-yellow-50 px-3 py-1 rounded-lg shadow-md mx-4 my-4 mt-2 border border-yellow-300">
                        <Text className="text-center text-gray-700 font-bold text-lg">
                          Completed Exercises: {completedExercises ? completedExercises.count.toString() : '0'}
                        </Text>
                      </View>
                      <View className="flex flex-row gap-1 pt-4">
                        <Pressable
                          onPress={() => {
                            navigation.navigate('Home')
                            setShowCompletedMessage(false);
                          }}
                          className="bg-cyan-700 py-2 rounded-lg mt-4 w-[50%]"
                        >
                          <Text className="text-white text-lg font-bold text-center">Home</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            setShowCompletedMessage(false);
                          }}
                          className="bg-cyan-700 py-2 rounded-lg mt-4 w-[50%]"
                        >
                          <Text className="text-white text-lg font-bold text-center">Review</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
              ) : null}
              {!checked  ?
              (
                <>
                  <TouchableOpacity
                  onPress={() => navigation.navigate('AddExerciseScreen', { workoutId: workoutId, workoutInfo: workoutInfo, refresh: true  })}
                  className={`absolute z-10 bottom-0 left-[5%] px-4 py-3 bg-indigo-500 rounded-xl ${userExercises.length === 0 || !allExercisesCompleted ? 'w-[90%]' : 'w-[75%]'}`}
                  >
                    <Text className='text-white text-[20px] font-medium text-center'>Add Exercise</Text>
                  </TouchableOpacity>
                  {allExercisesCompleted && userExercises.length > 0 ? (
                    <Pressable
                    onPress={handleCheckMark}
                    className="absolute z-10 bottom-0 right-[5%] px-2 py-[5px] bg-cyan-700 rounded-xl"
                  >
                    <Ionicons name="checkmark-circle-outline" size={40} color="white" />
                  </Pressable>
                  ) : null}
              </>
                ) : (
                  <View
                    className=' absolute z-10 bottom-0 left-[5%] px-4 py-3 bg-indigo-500 rounded-xl w-[90%]'
                    >
                      <Text className='text-white text-[20px] font-medium text-center'>Workout Completed</Text>
                  </View>
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
