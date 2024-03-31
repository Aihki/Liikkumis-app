import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {Text, TextInput, TouchableOpacity, View, Platform} from "react-native"
import {RootStackParamList} from "../types/LocalTypes";
import {useUserContext} from "../hooks/ContextHooks";
import {useWorkouts} from "../hooks/apiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import {useEffect, useState} from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";


const EditWorkoutScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'EditWorkoutScreen'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { workoutId } = route.params;
  const { user } = useUserContext();
  const { putWorkout, getUserWorkoutByWorkoutId, deleteWorkout } = useWorkouts();
  const [workoutInfo, setWorkoutInfo] = useState<any | null>(null);
  const [workout_name, setWorkoutName] = useState('');
  const [workout_description, setWorkoutDescription] = useState('');
  const [workoutDate, setWorkoutDate] = useState(workoutInfo?.workout_date ? new Date(workoutInfo?.workout_date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);



  const onDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || workoutDate;
    setShowDatePicker(Platform.OS === 'ios');
    setWorkoutDate(currentDate);
    console.log(currentDate)
  };

  const getWorkout = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {
      const workout = await getUserWorkoutByWorkoutId(user.user_id, workoutId, token);
      setWorkoutInfo(workout);
    } catch (error) {
      console.error(error);
    }
  };

  const editWorkout = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return;
    try {

      const workout = {
        user_id: user.user_id,
        user_workout_id: workoutId,
        workout_name,
        workout_description,
        workout_date: workoutDate.toISOString().split('T')[0],
      };

      await putWorkout(workout, token);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserWorkout = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token || !user) return;
  try {
    await deleteWorkout(user.user_id, workoutId, token);
    navigation.navigate('Home');
  } catch (error) {
    console.error(error);
  }

  };

  useEffect(() => { getWorkout(); }, []);


  return (
    <View className='flex flex-col items-center w-full pt-3 gap-3'>
      <Text className='text-[22px] pb-1'>Edit Workout</Text>
      <TextInput
        placeholder={workoutInfo?.workout_name}
        value={workout_name}
        onChangeText={setWorkoutName}
        className='p-2 border-gray-300 bg-gray-100 border w-[90%] rounded-xl'
      />
      <View className='relative w-[90%]'>
        <TextInput
          placeholder="Workout Description"
          value={workout_description}
          onChangeText={(text) => setWorkoutDescription(text.substring(0, 200))} // Limit to 200 characters
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className='p-2 border-gray-300 bg-gray-100 border rounded-xl '
        />
        <Text
          className={`absolute right-2 bottom-2 ${
            workout_description.length > 175
              ? workout_description.length >= 200
                ? 'text-red-500' // If input is 200 or more characters, text color is red
                : 'text-orange-500' // If input is more than 175 but less than 200, text color is orange
              : 'text-gray-600' // Otherwise, text color is normal
          }`}
        >
        {workout_description.length} / 200
      </Text>
    </View>
      <View className='flex w-full items-center justify-center  flex-row'>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} className='p-2 bg-gray-200 border border-gray-400 w-[45%]'>
        <Text className='text-center'>Edit Workout Date</Text>
      </TouchableOpacity>
      <Text
        className='w-[45%] text-center border-gray-400 border-y border-r p-2  bg-gray-200'
      >{workoutDate.toISOString().split('T')[0]}</Text>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={workoutDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TouchableOpacity
        onPress={editWorkout}
        className='px-4 py-2 bg-blue-500 rounded-xl'
      >
        <Text className='text-white text-[20px] font-medium'>Edit Workout</Text>
    </TouchableOpacity>
    <TouchableOpacity
        onPress={deleteUserWorkout}
        className='px-4 py-2 bg-red-500 rounded-xl'
      >
        <Text className='text-white text-[18px] font-medium'>Delete Workout</Text>
    </TouchableOpacity>
    </View>
  )
}

export default EditWorkoutScreen
