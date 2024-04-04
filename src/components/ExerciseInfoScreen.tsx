import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/LocalTypes";

import { useUserContext } from "../hooks/ContextHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import CardioExerciseInfo from "./CardioExerciseInfo";
import BodyWeightExerciseInfo from "./BodyWeightExerciseInfo";
import GymExerciseInfo from "./GymExerciseInfo";
import { useExercise } from "../hooks/apiHooks";

const ExerciseInfoScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ExerciseInfoScreen'>>();
  const { exerciseId } = route.params;
  const { user } = useUserContext();

  const { getUserSpecificExercises } = useExercise();

  const [exercise, setExercise] = useState<any | null>(null);


  const getExercise = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    const response = await getUserSpecificExercises(user.user_id, exerciseId, token);
    setExercise(response[0]);
  }


  useEffect(() => { getExercise() }, []);
  console.log(exercise);
  return (
    <>
      <Text className="text-[22px] font-medium text-center pt-4">Exercise Info</Text>
      <>
        {exercise ? (
          <>
            {exercise.exercise_duration === 0 && exercise.exercise_distance === 0 && exercise.exercise_weight > 0 ? (
              // Gym
              <>
                <View className="flex p-5 m-3 bg-white rounded-xl item-center">
                  <Text className="text-lg font-bold text-gray-800 mb-1">{exercise.exercise_name}</Text>
                  <Text className="text-base text-gray-600 mb-0.5">Weight: {exercise.exercise_weight} lbs</Text>
                  <Text className="text-base text-gray-600 mb-0.5">Reps: {exercise.exercise_reps} reps</Text>
                  <Text className="text-base text-gray-600 mb-2">Sets: {exercise.exercise_sets} sets</Text>
                </View>
                <View className="flex p-5 m-3 bg-white rounded-xl item-center">
                  <GymExerciseInfo exercise={exercise} />
                </View>
              </>
            ) : exercise.exercise_weight === 0 && exercise.exercise_distance === 0 && exercise.exercise_duration > 0 ? (
              // Body weight with duration
              <View className="flex p-5 m-3 bg-white rounded-xl item-center">
                <Text className="text-lg font-bold text-gray-800 mb-1">{exercise.exercise_name}</Text>
                <Text className="text-base text-gray-600 mb-2">Duration: {exercise.exercise_duration} seconds</Text>
              </View>
            ) : exercise.exercise_weight === 0 && (exercise.exercise_distance !== 0 || exercise.exercise_duration > 0) ? (
              // Cardio
              <>
                <View className="flex p-5 m-3 bg-white rounded-xl item-center">
                  <Text className="text-lg font-bold text-gray-800 mb-1">{exercise.exercise_name}</Text>
                  <Text className="text-base text-gray-600 mb-0.5">Distance: {exercise.exercise_distance} km</Text>
                  <Text className="text-base text-gray-600 mb-2">Duration: {exercise.exercise_duration} minutes</Text>
                </View>
                <View className="flex p-5 m-3 bg-white rounded-xl item-center">
                  <CardioExerciseInfo exercise={exercise} />
                </View>
              </>
            ) : (
              // Body weight with reps
              <>
                <View className="flex p-5 m-3 bg-white rounded-xl item-center">
                  <Text className="text-lg font-bold text-gray-800 mb-1">Name: {exercise.exercise_name}</Text>
                  <Text className="text-base text-gray-600 mb-0.5">Reps: {exercise.exercise_reps}</Text>
                  <Text className="text-base text-gray-600 mb-2">Sets: {exercise.exercise_sets}</Text>
                </View>
                <View className="flex p-5 m-3 bg-white rounded-xl item-center">
                  <BodyWeightExerciseInfo exercise={exercise} />
                </View>
              </>
            )}
          </>
        ) : (
          // Placeholder for loading or null state
          <Text>Loading exercise details...</Text>
        )}
      </>
    </>
  );

}

export default ExerciseInfoScreen
