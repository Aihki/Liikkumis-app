import { FlatList, Image, ImageSourcePropType, Pressable, Text, View } from "react-native"
import { useWorkouts } from "../hooks/apiHooks"
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../hooks/ContextHooks";
import { UserWorkout } from "../types/DBTypes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/LocalTypes";
import gymImage from '../../assets/images/gym-exercise.jpg'
import gymImage2 from '../../assets/images/gym-exercise-2.jpg'
import cardioImage from '../../assets/images/cardio-exercise-2.jpg'

type WorkoutTypeImages = {
  [key: string]: any; // Add this line
  'Cardio': ImageSourcePropType;
  'Gym': ImageSourcePropType;
  'Body Weight': ImageSourcePropType;
};



const WorkoutHistoryScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { getCompletedWorkouts } = useWorkouts();
  const { user } = useUserContext();

  const [ workouts, setWorkouts ] = useState<UserWorkout[] | []>([]);
  const [pressedId, setPressedId] = useState(null);

  const handlePressIn = (id: any) => setPressedId(id);
  const handlePressOut = () => setPressedId(null);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const getWorkouts =  async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const completedWorkouts = await getCompletedWorkouts(user.user_id, token);

      setWorkouts(completedWorkouts);
    } catch (error) {
      console.error(error);
    }
  }

  const workoutTypeImages: WorkoutTypeImages = {
    'Gym': gymImage,
    'Cardio': cardioImage,
    'Body Weight': gymImage2,
  };

  useEffect(() => { getWorkouts(); }, [])
  console.log(workouts);

  return (
    <View className=" pt-4 h-[92%]">
      <Text className="w-full text-center font-medium text-[24px] pb-4">Workout History</Text>
      <View className=" border border-gray-300 border-b-[1px] w-full opacity-50"/>
      <View className="px-3">
      {workouts !== null && workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.user_workout_id.toString()}
          contentContainerStyle={{ paddingBottom: 5 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate('WorkoutDetails', { workoutId: item.user_workout_id, refresh: true  })

              }}
              onPressIn={() => handlePressIn(item.user_workout_id)}
              onPressOut={handlePressOut}
              className={`mb-1 overflow-hidden rounded-lg shadow-lg relative ${pressedId === item.user_workout_id ? 'bg-gray-100 border border-gray-200' : ''}`}

            >
              <View className="bg-white  rounded-lg   relative overflow-hidden">
                <View className="p-5 py-4 z-10">
                  <Text className="text-xl font-bold mb-2">{truncateText(item.workout_name, 22)}</Text>
                  <Text className="text-gray-800 mb-1">Date: {item.workout_date?.toString().split('T')[0]}</Text>
                  <Text className="text-gray-400">Created at: {new Date(item.created_at).toISOString().split('T')[0]}</Text>
                </View>
                <Image source={workoutTypeImages[item.workout_type]} className="w-[46%] h-full  mr-4 absolute -right-16 rounded-r-xl" />
                <View className="absolute -bottom-10 -right-20 bg-white h-[99%] w-[100%] transform rotate-45 translate-x-1/2 -translate-y-1/2 z-[2] "/>

              </View>
            </Pressable>
          )}
          className="mt-2"
        />
      ) : (
        <View className="h-full justify-center items-center">
          <Text className="text-lg text-gray-500">No workouts listed.</Text>
        </View>
      )}
      </View>
    </View>
  )
}

export default WorkoutHistoryScreen
