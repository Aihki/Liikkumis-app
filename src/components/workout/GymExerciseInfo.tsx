import { Text } from "react-native"
import { View } from "react-native"
import { Exercise } from "../../types/DBTypes"
import { useUserContext } from "../../hooks/ContextHooks"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { PersonalBestCompareResponse, PersonalBestSuccessResponse } from "../../types/MessageTypes"
import { useExercise } from "../../hooks/apiHooks"
import FontAwesome from "react-native-vector-icons/FontAwesome";

const GymExerciseInfo = ({exercise}: {exercise: Exercise}) => {

  const { exercise_name, exercise_weight } = exercise;

  const { getPersonalBestByExerciseName, comparePersonalBest } = useExercise();
  const { user } = useUserContext();

  const [personalBest, setPersonalBest] = useState<PersonalBestSuccessResponse | null>(null);
  const [compare, setCompare] = useState<PersonalBestCompareResponse>();

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

  const comparePB = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !user) return
      const response = await comparePersonalBest(user.user_id, exercise_name, token)
      const parsedData = response.map(item => ({
        ...item,
        average_max_weight: parseFloat(item.average_max_weight),
        max_weight: parseFloat(item.max_weight),
        percentage_above_average: parseFloat(item.percentage_above_average),
        user_id: parseInt(item.user_id, 10)
      }));

      setCompare(parsedData[0]);
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    getPersonalBest();
    comparePB();
  }, [exercise]);

  return (
    <>
        <View className="items-center pb-3">
          <Text className="font-medium text-[21px]">Exercise Data</Text>
        </View>
      <View className="bg-white rounded-lg p-4 text-center">
        <View className="mb-4">
          {personalBest ? (
            <View className="flex-row items-center justify-center">
              <FontAwesome name="trophy" size={33} color="orange" />
              <Text className="font-bold text-lg ml-2">
                Personal Best: {`${personalBest.max_weight} kg`}
              </Text>
            </View>
          ) : (
            <Text className="text-lg">
              No Personal Best Recorded
            </Text>
          )}
        </View>

        {compare && typeof compare.percentage_above_average === 'number' ? (
          compare.percentage_above_average < 0 ? (
            <View className="flex flex-row items-center justify-center gap-2">
              <FontAwesome name="arrow-down" size={30} color="red"  />
              <Text className="font-bold text-lg pt-2">
                PB is {Math.round(Math.abs(compare.percentage_above_average))}% below average
              </Text>
            </View>
          ) : (
            <View className="flex flex-row items-center justify-center gap-2">
              <FontAwesome name="arrow-up" size={30} color="green" />
              <Text className="font-bold text-lg pt-2">
                Your PB is {Math.round(compare.percentage_above_average)}% above average
              </Text>
            </View>
          )
        ) : (
          <Text className="text-lg">
            No Comparison Data
          </Text>
        )}
      </View>
    </>
  );

}

export default GymExerciseInfo
