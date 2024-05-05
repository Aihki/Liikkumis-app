import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {Text, TextInput, TouchableOpacity, View, Platform, StyleSheet} from "react-native"
import {RootStackParamList} from "../../types/LocalTypes";
import {useUserContext} from "../../hooks/ContextHooks";
import {useWorkouts} from "../../hooks/apiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import {useEffect, useState} from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
;

const EditWorkoutScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'EditWorkout'>>();
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
        workout_type: workoutInfo?.workout_type,
        workout_date: workoutDate.toISOString().split('T')[0],
      };

      await putWorkout(workout, token);
      navigation.navigate('Exercise');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserWorkout = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token || !user) return;
  try {
    await deleteWorkout(user.user_id, workoutId, token);
    navigation.navigate('Exercise');
  } catch (error) {
    console.error(error);
  }
  };



  useEffect(() => { getWorkout(); }, []);


  return (
    <View className='flex flex-col items-center w-full pt-5'>
      <Text className='text-[24px] pb-5 text-bold'>Edit Workout</Text>
      <View className="relative w-full items-center">
      <TextInput
        placeholder={workoutInfo?.workout_name}
        value={workout_name}

        textAlignVertical="center"
        onChangeText={(text) => setWorkoutName(text.substring(0, 30))}
        style={{
          paddingVertical: Platform.OS === 'ios' ? 18 : 11,
          marginBottom: 18,
          paddingHorizontal: 10,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          width: '90%',
          backgroundColor: '#F3F4F6',
        }}
      />
      <Text
          className={`absolute  ${Platform.OS === 'ios' ? 'right-7 bottom-9' : 'right-7 bottom-8'} ${
            workout_name.length > 25
              ? workout_name.length >= 30
                ? 'text-red-400'
                : 'text-orange-500'
              : 'text-gray-600'
          }`}
        >
        {workout_name.length} / 30
      </Text>
      </View>
      <View className='relative w-[90%]'>
        <TextInput
          placeholder="Workout Description"
          value={workout_description}
          onChangeText={(text) => setWorkoutDescription(text.substring(0, 200))}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={{
            height: 110,
            padding: 10,
            paddingTop: Platform.OS === 'ios' ? 12 : 10,

            borderColor: '#ccc',
            backgroundColor: '#F3F4F6',
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 16,
          }}
        />

      <Text
        className={`absolute right-2 bottom-6 ${
          workout_description.length > 175
            ? workout_description.length >= 200
              ? 'text-red-500'
              : 'text-orange-500'
            : 'text-gray-600'
        }`}
      >
      {workout_description.length} / 200
    </Text>
  </View>
  <View className={`flex w-full items-center justify-center  flex-row`}>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className={`p-2 bg-gray-200 border border-gray-300 mb-1 ${Platform.OS === 'ios' ? ' ml-2' : ''}`}
        style={{width: Platform.OS === 'ios' ? '30%' : '45%', borderRadius: Platform.OS === 'ios' ? 10 : 0}}
        >
        <Text
          className={`text-center`}
        >
          Select Workout Date
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className='p-2 bg-gray-200 border border-gray-300 w-[45%] mb-1'
        style={{display: Platform.OS === 'ios' ? 'none' : 'flex'}}
      >
      <Text className='text-center'>
        {workoutDate.toISOString().split('T')[0]}
      </Text>
      </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={workoutDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <View className="w-full h-[100%] items-center relative">
        <TouchableOpacity
          onPress={editWorkout}
          className={`px-4 py-2 bg-indigo-500 rounded-lg w-[90%] ${Platform.OS === 'ios' ? 'mt-3' : ''}`}
        >
          <Text className='text-white text-[20px] font-medium text-center'>Edit Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={deleteUserWorkout}
            className='px-4 py-2 bg-red-500 rounded-lg w-[90%] mt-3 '
        >
            <Text className='text-white text-[20px] font-medium text-center'>Delete Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 50, // Adjust the height as needed
    width: '90%',
  },
  selectedText: {
    fontSize: 16,
    color: 'black',
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default EditWorkoutScreen
