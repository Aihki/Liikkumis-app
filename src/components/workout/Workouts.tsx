import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../../hooks/ContextHooks"
import { useWorkouts } from "../../hooks/apiHooks"
import { UserWithNoPassword, UserWorkout } from "../../types/DBTypes";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ImageSourcePropType, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/LocalTypes";
import gymImage from '../../assets/images/gym-exercise.jpg'
import gymImage2 from '../../assets/images/gym-exercise-2.jpg'
import cardioImage from '../../assets/images/cardio-exercise-2.jpg'
import { useFocusEffect } from '@react-navigation/native';

type WorkoutsProps = {
  updateWorkouts: boolean;
}

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

  const navigateToWorkoutHistory = () => {
    if (typeof user?.user_id !== 'number') return;
    navigation.navigate('WorkoutHistoryScreen', { userId: user.user_id });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!user) return;

      const fetchWorkouts = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token || !user) return;
        try {
          const getWorkouts = await getUserWorkouts(user.user_id, token);
          setWorkouts(getWorkouts);
        } catch (error) {
          console.error(error);
        }
      };

      fetchWorkouts();
    }, [user])
  );

  const workoutTypeImages: WorkoutTypeImages = {
    'Gym': gymImage,
    'Cardio': cardioImage,
    'Body Weight': gymImage2,
  };


  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    date.setUTCDate(date.getUTCDate() + 1);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  return (
    <>
      <View className=" pt-10 h-[93%]">
        <Text className="w-full text-center font-medium text-[24px] pb-4">Current Workouts</Text>
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
                    <Text className="text-gray-500">{formatDate(item.workout_date)}</Text>
                    <Text className="text-gray-400">Created at: {item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : ''}</Text>
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
      <View className=" shadow-lg  flex items-center justify-center pt-1">
      <TouchableOpacity
        onPress={() => navigateToWorkoutHistory()}
        className='px-4 py-2 bg-blue-500 rounded-xl w-[90%]'>
        <Text className='text-white text-[20px] font-medium text-center'>Workout History</Text>
      </TouchableOpacity>
    </View>
  </>
  )
}

export default Workouts
