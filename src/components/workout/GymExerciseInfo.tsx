import { Text } from "react-native"
import { View } from "react-native"
import { Exercise } from "../../types/DBTypes"
import { useUserContext } from "../../hooks/ContextHooks"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { PersonalBestSuccessResponse } from "../../types/MessageTypes"
import { useExercise } from "../../hooks/apiHooks"

const GymExerciseInfo = ({exercise}: {exercise: Exercise}) => {

  const { exercise_name, exercise_weight } = exercise;

  const { getPersonalBestByExerciseName } = useExercise();
  const { user } = useUserContext();

  const [personalBest , setPersonalBest] = useState<PersonalBestSuccessResponse | null>(null);

  const getPersonalBest = async () => {
    const token =  await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const response = await getPersonalBestByExerciseName(user.user_id, exercise.exercise_name, token);
      setPersonalBest(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { getPersonalBest(); }, [exercise]);

  console.log(personalBest);
  return (
    <View className="p-5">
      <Text className="text-[18px] font-medium mb-3 text-center">
       Your {exercise_name} Records
      </Text>
      <Text className='text-lg text-center mt-2'>
      {personalBest ? (
      <>
      Personal Best:
      <Text className="font-bold">
        {` ${personalBest.max_weight} kg`}
      </Text>
    </>
  ) : (
    'No Personal Best Recorded'
  )}
</Text>

    </View>
  );
}

export default GymExerciseInfo
