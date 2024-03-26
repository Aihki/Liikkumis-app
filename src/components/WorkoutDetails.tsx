import { RouteProp, useRoute } from "@react-navigation/native";
import { FlatList, Text, View } from "react-native"
import { RootStackParamList } from "../types/LocalTypes";
import { useExcersise } from "../hooks/apiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Exercise } from "../types/DBTypes";
import { useUserContext } from "../hooks/ContextHooks";
import AddExercise from "./AddExercise";




const WorkoutDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'WorkoutDetails'>>();
  const { workoutId } = route.params;
  const { user } = useUserContext()
  const { getUsersExcersisesByWorkoutId } = useExcersise();

  const [exercises, setExercises] = useState<Exercise[] | []>([])



  const exercisesByWorkoutId = async (workoutId: string) => {
    const token = await AsyncStorage.getItem('token')
    if (!token || !user) return
    try {
      const uExercises = await getUsersExcersisesByWorkoutId(String(user.user_id), workoutId, token);
      setExercises(uExercises)

    } catch (e) {
      console.error((e as Error).message);
    }
  }

  useEffect(() => { exercisesByWorkoutId(String(workoutId)) }, [])
  return (
    <>
      <AddExercise  workoutId={workoutId} />
      {exercises && exercises.length > 0 ? (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({item}) => (
            <View>
                <Text>{item.user_workout_id}</Text>
                <Text>{item.exercise_name}</Text>
            </View>
          )}
        />
      ) : (
        <Text></Text>
      )}

    </>
  )
}

export default WorkoutDetails
