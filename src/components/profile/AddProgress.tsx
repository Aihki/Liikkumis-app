import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../../hooks/ContextHooks';
import { useUserProgress } from '../../hooks/apiHooks';
import { UserProgress } from '../../types/DBTypes';
import { useNavigation } from '@react-navigation/native';
import Toast, { BaseToastProps, ErrorToast } from 'react-native-toast-message';

const AddProgress = () => {
  const {user} = useUserContext();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {postProgress} = useUserProgress();
  const navigation = useNavigation();
  const [formState, setFormState] = useState<Partial<UserProgress>>({
    progress_height: 0,
    progress_weight: 0,
    progress_circumference_chest: 0,
    progress_circumference_waist: 0,
    progress_circumference_thigh_r: 0,
    progress_circumference_thigh_l: 0,
    progress_circumference_bicep_r: 0,
    progress_circumference_bicep_l: 0,
    progress_circumference_calves_r: 0,
    progress_circumference_calves_l: 0,
  });

  const handleChange = (field: string, value: string) => {
    const numberValue = Number(value);

    setFormState({
      ...formState,
      [field]: numberValue !== 0 ? numberValue : null,
    });
  };

  const addProgress = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!user || !token) {
        console.log("User or token not found.");
        return;
      }

      if (!formState) {
        console.log("Form state is not defined.");
        return;
      }

      const progressData: Omit<UserProgress, 'progress_id' | 'created_at'> = {
        user_id: user.user_id,
        progress_date: date,
        progress_weight: formState.progress_weight || 0,
        progress_height: formState.progress_height || 0,
        progress_circumference_chest: formState.progress_circumference_chest || 0,
        progress_circumference_waist: formState.progress_circumference_waist || 0,
        progress_circumference_thigh_r: formState.progress_circumference_thigh_r || 0,
        progress_circumference_thigh_l: formState.progress_circumference_thigh_l || 0,
        progress_circumference_bicep_r: formState.progress_circumference_bicep_r || 0,
        progress_circumference_bicep_l: formState.progress_circumference_bicep_l || 0,
        progress_circumference_calves_r: formState.progress_circumference_calves_r || 0,
        progress_circumference_calves_l: formState.progress_circumference_calves_l || 0,
      };

      const hasZeroValue = Object.values(progressData).some(value => value === 0);

      if (hasZeroValue) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Input',
          text2: 'Progress values cannot be 0.',
        });
        return;
      }

      await postProgress(progressData, user.user_id);
      navigation.goBack();
    } catch (error) {
      console.error("An error occurred while adding progress: ", error);
    }
  };



  const onChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    // Update the date field in the formState
    handleChange('date', currentDate.toISOString());
  };

  const toastConfig = {
    error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
      <ErrorToast
        {...props}
        style={{height: 100, borderLeftColor: 'red'}}
        text1Style={{
          fontSize: 17,
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 15
        }}
      />
    ),
  };

  return (

    <View className="flex-1 justify-center items-center">
      <Text className='text-2xl'>Add Progress</Text>
      <View className="flex-row justify-between items-start">
        <View className="flex-1 justify-center m-2">
          <Text className="text-left">Height</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Height"
            value={formState.progress_height?.toString()}
            onChangeText={(value) => handleChange('progress_height', value)}
          />
          <Text className="text-left">Weight</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Weight"
            value={formState.progress_weight?.toString()}
            onChangeText={(value) => handleChange('progress_weight', value)}
          />
          <Text className="text-left">Bicep left</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Bicep Left"
            value={formState.progress_circumference_bicep_l?.toString()}
            onChangeText={(value) => handleChange('progress_circumference_bicep_l', value)}
          />
          <Text className="text-left">Bicep right</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Bicep Right"
            value={formState.progress_circumference_bicep_r?.toString()}
            onChangeText={(value) => handleChange('progress_circumference_bicep_r', value)}
          />
          <Text className="text-left">Calves left</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Calves Left"
            value={formState.progress_circumference_calves_l?.toString()}
            onChangeText={(value) => handleChange('progress_circumference_calves_l', value)}
          />
          <Text>Calves Right</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Calves Right"
            value={formState.progress_circumference_calves_r?.toString()}
            onChangeText={(value) => handleChange('progress_circumference_calves_r', value)}
          />
        </View>
        <View className="flex-1 justify-center m-2">
          <Text className="text-left">Chest</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Chest"
            value={formState.progress_circumference_chest?.toString()}
            onChangeText={(value) => handleChange('progress_circumference_chest', value)}
          />
          <Text className="text-left">Waist</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Waist"
            value={formState.progress_circumference_waist?.toString()}
            onChangeText={(value) => handleChange('progress_circumference_waist', value)}
          />
          <Text className="text-left">Thigh left</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Thigh Left"
            value={formState.progress_circumference_thigh_l?.toString()}
            onChangeText={(value) => handleChange('progress_circumference_thigh_l', value)}
          />
          <Text className="text-left">Thigh Right</Text>
          <TextInput
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
            placeholder="Thigh Right"
            value={formState.progress_circumference_thigh_r?.toString()}
            onChangeText={(value) => handleChange('progress_circumference_thigh_r', value)}
          />
          <Text className="text-left">Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg  m-1"
          >
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode={'date'}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
      </View>
        <TouchableOpacity
        onPress={addProgress}
        className='bg-green-500 p-2 rounded-lg w-1/2 self-center m-1.5'
      >
        <Text className='text-white font-bold text-lg text-center'>Upload Progress</Text>
    </TouchableOpacity>
        <Toast config={toastConfig} />
    </View>
  );
};
export default AddProgress;
