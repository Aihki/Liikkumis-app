import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../../hooks/ContextHooks"
import { useWorkouts } from "../../hooks/apiHooks"
import { UserWithNoPassword, UserWorkout } from "../../types/DBTypes";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Pressable, Animated, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/LocalTypes";
import gymImage from '../../assets/images/gym-exercise.jpg'
import gymImage2 from '../../assets/images/gym-exercise-2.jpg'
import cardioImage from '../../assets/images/cardio-exercise-2.jpg'
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FontAwesome6 } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';


type WorkoutsProps = {
  updateWorkouts: boolean;
}

const Workouts: React.FC<WorkoutsProps> = ({ updateWorkouts }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getUserWorkouts, deleteWorkout } = useWorkouts();
  const { user } = useUserContext();
  const [workouts, setWorkouts] = useState<UserWorkout[] | null >(null)
  const [filteredWorkouts, setFilteredWorkouts] = useState<UserWorkout[] | null >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isOpen, setIsOpen] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const fetchWorkouts = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token || !user) return;
        const fetchedWorkouts = await getUserWorkouts(user.user_id, token);
        setWorkouts(fetchedWorkouts);
        setFilteredWorkouts(fetchedWorkouts);
      };

      fetchWorkouts();
    }, [user])
  );

  useEffect(() => {
    const formattedQuery = searchQuery.toLowerCase();
    if (!workouts) return
    const results = workouts.filter(workout => {
      const matchesType = filterType ? workout.workout_type === filterType : true;
      const matchesQuery = workout.workout_name.toLowerCase().includes(formattedQuery) ||
                           workout.workout_date.toString().toLowerCase().includes(formattedQuery);
      return matchesType && matchesQuery;
    });

    setFilteredWorkouts(results);
  }, [searchQuery, filterType, workouts]);

  const handleFilterPress = (type: string) => {
    setFilterType(prev => prev === type ? "" : type);
  };

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    date.setUTCDate(date.getUTCDate() + 1);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  const navigateToWorkoutHistory = () => {
    if (typeof user?.user_id !== 'number') return;
    navigation.navigate('WorkoutHistoryScreen', { userId: user.user_id });
    setIsOpen(false);
  };

  const navigateToChallenges = () => {
    if (typeof user?.user_id !== 'number') return;
    navigation.navigate('Challenges')
    setIsOpen(false);
  };

  const deleteUserWorkout =  async (workoutId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !user) return
      await deleteWorkout(user.user_id, workoutId, token)
      const updatedWorkouts = workouts?.filter(workout => workout.user_workout_id !== workoutId);
      const updatedFilteredWorkouts = filteredWorkouts?.filter(workout => workout.user_workout_id !== workoutId);
    setWorkouts(updatedWorkouts);
    setFilteredWorkouts(updatedFilteredWorkouts);
    } catch (error) {
      console.log('error could not delete workout')
    }
  };

  const workoutWarning = async (workoutId: number) => {
    if (!user) return;
    Alert.alert("Delete Exercise", "Are you sure you want to delete this exercise?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => deleteUserWorkout(workoutId)},
    ]);
  };

  const renderRightActions = (workoutId: number) => (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        className="w-[100px] h-[96%] bg-red-500 items-center justify-center border-right rounded-r-lg"
        onPress={() => workoutWarning(workoutId)}
      >
        <Text className="text-white font-medium text-[18px]">Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <GestureHandlerRootView className="pt-10 h-[93%]">
        <View className="relative">
          <Text className="w-full text-center font-medium text-[24px] pb-4">Active Workouts</Text>
          <FontAwesome
                name={isOpen ? 'times' : 'bars'}
                size={23}
                color={isOpen ? '#424242' : "black"}
                style={{position: "absolute", top: 8, left: 17, zIndex: 20}}
                onPress={() => setIsOpen(!isOpen)}
              />
          {isOpen && (
            <View className="bg-stone-100 p-3 pb-2 z-10 absolute top-full right-0 w-full shadow-md">
                <TouchableOpacity onPress={() => navigateToWorkoutHistory()} className="relative border-b w-full border-gray-200">
                  <FontAwesome
                    name="history"
                    size={28}
                    color="black"
                    style={{position: "absolute", top: 11, left: 7, zIndex: 20}}
                    onPress={() => setIsOpen(!isOpen)}
                  />
                  <Text className="text-black font-medium text-lg p-2 ml-10">Workout History</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToChallenges()} className="relative border-b w-full border-gray-200">
                  <FontAwesome
                      name="gamepad"
                      size={28}
                      color="black"
                      style={{position: "absolute", top: 7, left: 5, zIndex: 20}}
                      onPress={() => setIsOpen(!isOpen)}
                  />
                  <Text className="text-black font-medium text-lg p-2 ml-10">Challenges</Text>
                </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="border border-gray-300 border-b-[1px] w-full opacity-50"/>
        <View className="px-3">
          <View className="flex my-[9px] w-full">
            <TextInput
              placeholder="Search"
              clearButtonMode="always"
              autoCapitalize="none"
              autoCorrect={false}
              className="py-[8px] px-[10px] border border-[#ccc] rounded-[10px]"
              value={searchQuery}
              onChangeText={(query) => setSearchQuery(query)}
            />
          </View>
          <View className="flex flex-row space-x-5 justify-center pb-2">
            <TouchableOpacity onPress={() => handleFilterPress('Gym')} className={`border py-[6px] px-4 rounded-xl ${filterType === 'Gym' ? 'bg-green-100 border-[#4ade80]' : 'bg-gray-100 border-[#6ccf91]'}`}>
              <Text className="text-[15px]">Gym</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterPress('Body Weight')} className={`border py-[6px] px-4 rounded-xl ${filterType === 'Body Weight' ? 'bg-green-100 border-[#4ade80]' : 'bg-gray-100 border-[#6ccf91]'}`}>
              <Text className="text-[15px]">Body Weight</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterPress('Cardio')} className={`border py-[6px] px-4 rounded-xl ${filterType === 'Cardio' ? 'bg-green-100 border-[#4ade80]' : 'bg-gray-100 border-[#6ccf91]'}`}>
              <Text className="text-[15px]">Cardio</Text>
            </TouchableOpacity>
          </View>
          {filteredWorkouts ? (
            <FlatList
            data={filteredWorkouts}
            keyExtractor={(item) => item.user_workout_id.toString()}
            contentContainerStyle={{ paddingBottom: 5 }}
            renderItem={({ item }) => (
              <Swipeable renderRightActions={renderRightActions(item.user_workout_id)}>
              <Pressable
                onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.user_workout_id, refresh: true })}
                className={`mb-1 overflow-hidden rounded-lg shadow-lg relative`}
              >
                <View className="bg-white rounded-lg relative overflow-hidden m-[3px]">
                  <View className="p-5 py-4 z-10">
                    <Text className="text-xl font-bold mb-2">{item.workout_name}</Text>
                    <Text className="text-gray-500">{formatDate(item.workout_date)}</Text>
                    <Text className="text-gray-400">Created at: {item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : ''}</Text>
                  </View>
                  <Image source={item.workout_type === 'Gym' ? gymImage : item.workout_type === 'Cardio' ? cardioImage : gymImage2} className="w-[46%] h-full mr-4 absolute -right-16 rounded-r-xl" />
                  <View className="absolute -bottom-10 -right-20 bg-white h-[99%] w-[100%] transform rotate-45 translate-x-1/2 -translate-y-1/2 z-[2]" />
                </View>
              </Pressable>
              </Swipeable>
            )}
          />
          ) : (
            <View className="flex items-center justify-center gap-2 h-full pb-[200px]">
              <FontAwesome6
                name="dumbbell"
                size={44}
                color="black"
                style={{}}
              />
              <View className="relative">
                <Text className="text-center text-[19px]">
                  No active workouts found. Add a workout by clicking the
                </Text>
                <View className="absolute right-[21%] top-[20%] translate-y-[-50%]">
                  <Text className="font-extrabold text-[38px]"> + </Text>
                </View>
              </View>
            </View>
          )}

        </View>
      </GestureHandlerRootView>
    </>
  );
};

export default Workouts;
