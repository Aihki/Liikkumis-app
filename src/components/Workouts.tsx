import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../hooks/ContextHooks"
import { useWorkouts } from "../hooks/apiHooks"
import { UserWithNoPassword, UserWorkout } from "../types/DBTypes";
import { useEffect, useState } from "react";
import { FlatList, Image, ImageSourcePropType, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/LocalTypes";
import gymImage from '../../assets/images/gym-exercise.jpg'
import cardioImage from '../../assets/images/cardio-exercise.jpg'
import bodyWeightImage from '../../assets/images/body-w-exercise.jpg'

type WorkoutsProps = {
  updateWorkouts: boolean;
}

type WorkoutType = 'Gym' | 'Cardio' | 'Body Weight';

type WorkoutTypeImages = {
  [key: string]: any; // Add this line
  'Cardio': ImageSourcePropType;
  'Gym': ImageSourcePropType;
  'Body Weight': ImageSourcePropType;
};

const Workouts: React.FC<WorkoutsProps> = ({ updateWorkouts }) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { getUserWorkouts } = useWorkouts()
  const { user } = useUserContext();
  const [workouts, setWorkouts] = useState<UserWorkout[] | null >(null)
  const [pressedId, setPressedId] = useState(null);

  const handlePressIn = (id: any) => setPressedId(id);
  const handlePressOut = () => setPressedId(null);


  const getUserWorkoutsById = async (user: UserWithNoPassword) => {
    const token =  await AsyncStorage.getItem('token');
    if (!token || !user) return
    try {
      const getWorkouts = await getUserWorkouts(user.user_id, token)
      setWorkouts(getWorkouts);
    } catch (error) {
      console.error(error)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    if(!user) return
    getUserWorkoutsById(user)
  }, [updateWorkouts])

  const workoutTypeImages: WorkoutTypeImages = {
    'Gym': gymImage,
    'Cardio': cardioImage,
    'Body Weight': bodyWeightImage,
  };

  return (
    <View className="px-4 pt-4 pb-2 h-full">
      <Text className="w-full text-center text-[22px] pb-3">Your Workouts</Text>
      {workouts && workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.user_workout_id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate('WorkoutDetails', { workoutId: item.user_workout_id, refresh: true  })

              }}
              onPressIn={() => handlePressIn(item.user_workout_id)}
              onPressOut={handlePressOut}
              className={`mb-1 overflow-hidden rounded-lg shadow-lg relative ${pressedId === item.user_workout_id ? 'bg-gray-100 border border-black' : ''}`}

            >
              <View className="bg-white  rounded-lg   relative overflow-hidden">
                <View className="p-5 z-10">
                  <Text className="text-xl font-bold mb-2">{truncateText(item.workout_name, 22)}</Text>
                  <Text className="text-gray-800 mb-1">Date: {item.workout_date?.toString().split('T')[0]}</Text>
                  <Text className="text-gray-400">Created at: {new Date(item.created_at).toISOString().split('T')[0]}</Text>
                </View>
                <Image source={workoutTypeImages[item.workout_type]} className="w-[45%] h-full  mr-4 absolute -right-5 rounded-t-xl" />
                <View className="absolute -bottom-10 -right-20 bg-white h-[97%] w-[100%] transform rotate-45 translate-x-1/2 -translate-y-1/2 z-[2] "/>

              </View>
            </Pressable>
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
