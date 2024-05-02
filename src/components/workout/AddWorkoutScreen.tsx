import { Text, TextInput, TouchableOpacity, View, Platform, StyleSheet  } from "react-native"
import { useWorkouts } from "../../hooks/apiHooks";
import { useUserContext } from "../../hooks/ContextHooks";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../types/LocalTypes";
import { Dropdown } from "react-native-element-dropdown";

type AddWorkoutScreenRouteProp = RouteProp<RootStackParamList, 'AddWorkoutScreen'>;

type AddWorkoutScreenProps = {
  route: AddWorkoutScreenRouteProp;
}

const AddWorkoutScreen: React.FC<AddWorkoutScreenProps> = ({ route }) => {
  const { onWorkoutAdded } = route.params;
  const { postWorkout } = useWorkouts();
  const { user } = useUserContext();
  const [workout_name, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [workout_description, setWorkoutDescription] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const onDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || workoutDate;
    setShowDatePicker(Platform.OS === 'ios');
    setWorkoutDate(currentDate);
    console.log(currentDate)
  };

  const addWorkoutHandler = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!user || !token) {
      console.log("User or token not found.");
      return;
    }


    try {
      const workout = {
        user_id: user.user_id,
        workout_name,
        workout_description,
        workout_type: workoutType,
        workout_date: workoutDate.toISOString().split('T')[0],
      };
      await postWorkout(workout, token);
      console.log("Workout added successfully.");
      onWorkoutAdded();
      setWorkoutName('');
      setWorkoutDescription('');
      setWorkoutDate(new Date());
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      console.error("Failed to add workout:", error.response ? error.response.data : error);
    }
  };


  const options = [
    { label: 'Gym', value: 'Gym' },
    { label: 'Body Weight', value: 'Body Weight' },
    { label: 'Cardio', value: 'Cardio' },
  ];

  return (
    <View className='flex flex-col items-center w-full pt-3 '>
      <Text className='text-[22px] pt-2 pb-4 '>Add New Workout</Text>
      <TextInput
        placeholder="Workout Name"
        value={workout_name}
        onChangeText={setWorkoutName}
        className='p-2 border-gray-300 bg-gray-100 border w-[90%] rounded-lg mb-4 '
      />
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        placeholder="Workout Type"
        value={workoutType}
        onChange={(item) => setWorkoutType(item.value)}
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholderText}
      />
      <View className='relative w-[90%]'>
        <TextInput
          placeholder="Workout Description"
          value={workout_description}
          onChangeText={(text) => setWorkoutDescription(text.substring(0, 200))}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className='p-2 border-gray-300 bg-gray-100 border rounded-lg  mb-4'
        />
      <Text
        className={`absolute right-2 bottom-5 ${
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
      <View className='flex w-full items-center justify-center  flex-row'>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} className='p-2 bg-gray-200 border border-gray-300 w-[45%]'>
        <Text className='text-center'>Select Workout Date</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} className='p-2 bg-gray-200 border border-gray-300 w-[45%]'>
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
      <TouchableOpacity
        onPress={addWorkoutHandler}
        className='px-4 py-2 bg-indigo-500 rounded-lg mt-4 w-[91%]'
      >
        <Text className='text-white text-[20px] text-center font-medium'>Add Workout</Text>
    </TouchableOpacity>
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
    marginBottom: 17,
    height: 50,
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

export default AddWorkoutScreen
