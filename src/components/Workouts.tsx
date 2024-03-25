import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../hooks/ContextHooks"
import { useWorkouts } from "../hooks/apiHooks"
import { UserWithNoPassword, UserWorkout } from "../types/DBTypes";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/LocalTypes";


interface WorkoutsProps {
  updateWorkouts: boolean;
}

const Workouts: React.FC<WorkoutsProps> = (updateWorkouts ) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { getUserWorkouts } = useWorkouts()
  const { user } = useUserContext();
  const [workouts, setWorkouts] = useState<UserWorkout[] | null >(null)

  const getUserWorkoutsById = async (user: UserWithNoPassword) => {
    const token =  await AsyncStorage.getItem('token');
    if (!token || !user) return

    const getWorkouts = await getUserWorkouts(user.user_id, token)
    setWorkouts(getWorkouts);
  }

  useEffect(() => {
    if(!user) return
    getUserWorkoutsById(user)
  }, [updateWorkouts])

  return (
    <View className="px-4 pt-10 pb-4">
      <Text className="w-full text-center text-[22px] pb-3">Workout History</Text>
      {workouts && workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.user_workout_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.user_workout_id })}>
              <View className="bg-white p-4 mb-4 rounded-lg shadow">
                <Text className="text-xl font-bold mb-2">{item.workout_name}</Text>
                <Text className="text-gray-800 mb-1">Date: {item.workout_date}</Text>
                <Text className="text-gray-600 mb-3">{item.workout_description}</Text>
                <Text className="text-gray-400">Created at: {new Date(item.created_at).toISOString().split('T')[0]}</Text>
                {/* Add more Text components here if needed */}
              </View>
            </TouchableOpacity>
          )}
          className="mt-2"
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">No workouts listed.</Text>
        </View>
      )}
    </View>
  )
}

export default Workouts
