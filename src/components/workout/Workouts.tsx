import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../../hooks/ContextHooks"
import { useWorkouts } from "../../hooks/apiHooks"
import { UserWithNoPassword, UserWorkout as OriginalUserWorkout } from "../../types/DBTypes";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Pressable, Animated, Alert, TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator } from "react-native";
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

type UserWorkout = OriginalUserWorkout & {
  isLoading: boolean;
};

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
        const workoutsWithLoading = fetchedWorkouts.map(workout => ({
          ...workout,
          isLoading: true  // Initialize isLoading to true
        }));
        setWorkouts(workoutsWithLoading);
        setFilteredWorkouts(workoutsWithLoading);
      };

      fetchWorkouts();
    }, [user])
  );

  const getImageSource = (type: string) => {
    switch (type) {
        case 'Gym': return gymImage;
        case 'Cardio': return cardioImage;
        default: return gymImage2;
    }
};

const handleImageLoad = (id: number) => {
  const updatedWorkouts = workouts?.map(workout => workout.user_workout_id === id ? { ...workout, isLoading: false } : workout);
  if (!updatedWorkouts) return
  setWorkouts(updatedWorkouts);
  setFilteredWorkouts(updatedWorkouts);
};

const handleImageError = (id: number) => {
  const updatedWorkouts = workouts?.map(workout => workout.user_workout_id === id ? { ...workout, isLoading: false } : workout);
  if (!updatedWorkouts) return
  setWorkouts(updatedWorkouts);
  setFilteredWorkouts(updatedWorkouts);
};

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
    date.setUTCDate(date.getUTCDate());  // Adding one day

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;  // Months are zero-indexed, add one to normalize
    const day = date.getUTCDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  const navigateToWorkoutHistory = () => {
    if (typeof user?.user_id !== 'number') return;
    navigation.navigate('WorkoutHistory', { userId: user.user_id });
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

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const workoutWarning = async (workoutId: number) => {
    if (!user) return;
    Alert.alert("Delete Exercise", "Are you sure you want to delete this exercise?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => deleteUserWorkout(workoutId)},
    ]);
  };

  const renderLeftActions = (progress, dragX, workoutId: number) => {
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        className="w-[100px] h-[90%] bg-red-500 items-center justify-center rounded-l-lg mt-1"
        onPress={() => workoutWarning(workoutId)}
      >
        <Text className="text-white font-medium text-[18px]">Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <GestureHandlerRootView className="pt-10 h-[93%]">
        <View className="relative z-50">
          <Text className="w-full text-center font-medium text-[24px] pb-4">Active Workouts</Text>
          <FontAwesome
                name={isOpen ? 'times' : 'bars'}
                size={23}
                color={isOpen ? '#424242' : "black"}
                style={{position: "absolute", top: Platform.OS === 'ios' ? 3 : 8, left: 17, zIndex: 20}}
                onPress={() => setIsOpen(!isOpen)}
              />
          {isOpen && (
            <View style={{ position:"absolute", width: '100%', top: 45, left: 0, zIndex: 30 }}>
            <View style={{ zIndex: 10, backgroundColor: 'white', height: '100%' }}>
              <TouchableOpacity onPress={navigateToWorkoutHistory} style={{ padding: 12, display: 'flex', flexDirection: 'row', borderBottomColor: "#ccc", borderBottomWidth: 1 }}>
                <FontAwesome name="history" size={28} color="black"/>
                <Text className="text-[18px] font-bold ml-2 pb-2">Workout History</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToChallenges} style={{ padding: 12, display: 'flex', flexDirection: 'row' }}>
                <FontAwesome name="gamepad" size={30} color="black"/>
                <Text className="text-[18px] font-bold ml-2">Challenges</Text>
              </TouchableOpacity>
            </View>
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
            style={{
              paddingVertical: Platform.OS === 'ios' ? 16 : 10,
              paddingHorizontal: 10,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
            }}
            value={searchQuery}
            onChangeText={(query) => setSearchQuery(query)}
          />
          </View>
          <View className="flex flex-row space-x-5 justify-center pb-2">
            <TouchableOpacity onPress={() => handleFilterPress('Gym')} className={`flex justify-center items-center border ${Platform.OS === 'ios' ? 'py-[10px]' : 'py-[7px]'} px-4 rounded-xl  ${filterType === 'Gym' ? 'bg-indigo-100 border-[#6366f1]' : 'bg-gray-100 border-[#818cf8]'}`}>
              <Text className="text-[15px]">Gym</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterPress('Body Weight')} className={`flex justify-center items-center border ${Platform.OS === 'ios' ? 'py-[10px]' : 'py-[7px]'}  px-4 rounded-xl ${filterType === 'Body Weight' ? 'bg-indigo-100 border-[#6366f1]' : 'bg-gray-100 border-[#818cf8]'}`}>
              <Text className="text-[15px]">Body Weight</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterPress('Cardio')} className={`flex justify-center items-center border ${Platform.OS === 'ios' ? 'py-[10px]' : 'py-[7px]'} px-4 rounded-xl ${filterType === 'Cardio' ? 'bg-indigo-100 border-[#6366f1]' : 'bg-gray-100 border-[#818cf8]'}`}>
              <Text className="text-[15px]">Cardio</Text>
            </TouchableOpacity>
          </View>
          {filteredWorkouts ? (
            <FlatList
            data={filteredWorkouts}
            keyExtractor={(item) => item.user_workout_id.toString()}
            contentContainerStyle={{ paddingBottom: 5 }}
            renderItem={({ item }) => (
              <Swipeable
              renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, item.user_workout_id)}
              >
              <Pressable
                onPress={() => navigation.navigate('WorkoutDetails', { workoutId: item.user_workout_id, refresh: true })}
                className={`mb-1 overflow-hidden rounded-lg shadow-lg relative`}
              >
                <View className="relative overflow-hidden m-[3px] min-h-[115px] bg-white rounded-lg">
        {item.isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ position: 'absolute', right: '1%', top: '50%', transform: [{ translateX: -25 }, { translateY: -25 }] }} />
    ) : null}
    <Image
        source={getImageSource(item.workout_type)}
        className="w-[46%] h-full mr-4 absolute -right-16 rounded-r-xl"
        onLoad={() => handleImageLoad(item.user_workout_id)}
        onError={() => handleImageError(item.user_workout_id)}
    />
    <View className="absolute -bottom-10 -right-20 bg-white h-[99%] w-[100%] transform rotate-45 translate-x-1/2 -translate-y-1/2 z-[2]" />

    <View className="p-5 py-4 z-10 mr-8">
        <Text className="text-xl font-bold mb-1">{truncateText(item.workout_name, 16)}</Text>
        <Text className="text-gray-500 mb-1">{formatDate(item.workout_date)}</Text>
        <Text className="text-gray-600">{truncateText(item.workout_description, 38)}</Text>
    </View>
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
                  No active workouts found
                </Text>

              </View>
            </View>
          )}

        </View>
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
};

export default Workouts;
