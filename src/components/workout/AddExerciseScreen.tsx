import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../types/LocalTypes";
import {useUserContext} from "../../hooks/ContextHooks";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, StyleSheet } from "react-native";
import GymExercise from "./GymExercise";
import BodyWeightExercise from "./BodyWeightExercise";
import CardioExercise from "./CardioExercise";

const AddExerciseScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'WorkoutDetails'>>();

  const { workoutId, workoutInfo } = route.params;

  return (
    <>
      <View>
        {workoutInfo && workoutInfo.workout_type === 'Gym' && <GymExercise workout={workoutInfo} workoutId={workoutId}  />}
        {workoutInfo && workoutInfo.workout_type === 'Body Weight' && <BodyWeightExercise workout={workoutInfo} workoutId={workoutId}/>}
        {workoutInfo && workoutInfo.workout_type === 'Cardio' && <CardioExercise workout={workoutInfo} workoutId={workoutId}/>}
      </View>
    </>
  )
}


export default AddExerciseScreen
