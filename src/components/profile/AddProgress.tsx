import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Toast, {BaseToastProps, ErrorToast} from 'react-native-toast-message';
import {useUserContext} from '../../hooks/ContextHooks';
import {useUserProgress} from '../../hooks/apiHooks';
import {UserProgress} from '../../types/DBTypes';
import TooltipButton from './ProgressGuide';

const AddProgress = () => {
  const {user} = useUserContext();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {postProgress, getUserProgress} = useUserProgress();
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

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        console.log('User not found.');
        return;
      }

      const userProgress = await getUserProgress(user.user_id);
      if (userProgress) {
        setFormState(userProgress[0]);
      } else {
        setFormState({
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
      }
    };

    fetchUserProgress();
  }, []);

  const handleChange = (field: string, value: string | Date) => {
    if (field === 'date') {
      setFormState((prevState) => ({...prevState, [field]: value}));
    } else {
      if (value === '') {
        setFormState((prevState) => ({...prevState, [field]: ''}));
      } else {
        const numberValue = Number(value);
        setFormState((prevState) => ({...prevState, [field]: numberValue}));
      }
    }
  };
  const addProgress = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!user || !token) {
        console.log('User or token not found.');
        return;
      }

      if (!formState) {
        console.log('Form state is not defined.');
        return;
      }

      const progressData: Omit<UserProgress, 'progress_id' | 'created_at'> = {
        user_id: user.user_id,
        progress_date: date,
        progress_weight: formState.progress_weight || 0,
        progress_height: formState.progress_height || 0,
        progress_circumference_chest:
          formState.progress_circumference_chest || 0,
        progress_circumference_waist:
          formState.progress_circumference_waist || 0,
        progress_circumference_thigh_r:
          formState.progress_circumference_thigh_r || 0,
        progress_circumference_thigh_l:
          formState.progress_circumference_thigh_l || 0,
        progress_circumference_bicep_r:
          formState.progress_circumference_bicep_r || 0,
        progress_circumference_bicep_l:
          formState.progress_circumference_bicep_l || 0,
        progress_circumference_calves_r:
          formState.progress_circumference_calves_r || 0,
        progress_circumference_calves_l:
          formState.progress_circumference_calves_l || 0,
      };

      await postProgress(progressData, user.user_id);
      navigation.goBack();
    } catch (error) {
      console.error('An error occurred while adding progress: ', error);
    }
  };

  const onChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

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
          fontSize: 15,
        }}
      />
    ),
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl">Add Progress</Text>
        <View className="flex-row justify-between items-start">
          <View className="flex-1 justify-center m-2">
            <Text className="ml-[5px]">Height</Text>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Height (cm)"
              value={formState.progress_height?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_height', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_height', value);
                  }
                }
              }}
            />
            <Text className="ml-[5px]">Weight</Text>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Weight (kg)"
              value={formState.progress_weight?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_weight', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_weight', value);
                  }
                }
              }}
            />
            <View className="flex flex-row justify-between items-center w-[55%]">
              <Text className="ml-[5px]">Bicep left</Text>
              <TooltipButton guideName="Bicep" />
            </View>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Bicep Left (cm)"
              value={formState.progress_circumference_bicep_l?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_circumference_bicep_l', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_circumference_bicep_l', value);
                  }
                }
              }}
            />
            <View className="flex flex-row justify-between items-center w-[55%]">
              <Text className="ml-[5px]">Bicep right</Text>
              <TooltipButton guideName="Bicep" />
            </View>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Bicep Right (cm)"
              value={formState.progress_circumference_bicep_r?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_circumference_bicep_r', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_circumference_bicep_r', value);
                  }
                }
              }}
            />
            <View className="flex flex-row justify-between items-center w-[55%]">
              <Text className="ml-[5px]">Calves left</Text>
              <TooltipButton guideName="Calves" />
            </View>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Calves Left (cm)"
              value={formState.progress_circumference_calves_l?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_circumference_calves_l', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_circumference_calves_l', value);
                  }
                }
              }}
            />
            <View className="flex flex-row justify-between items-center w-[55%]">
              <Text className="ml-[5px]">Calves Right</Text>
              <TooltipButton guideName="Calves" />
            </View>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Calves Right (cm)"
              value={formState.progress_circumference_calves_r?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_circumference_calves_r', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_circumference_calves_r', value);
                  }
                }
              }}
            />
          </View>
          <View className="flex-1 justify-center m-2">
            <View className="flex flex-row justify-between items-center w-[55%]">
              <Text className="ml-[5px]">Chest</Text>
              <TooltipButton guideName="Chest" />
            </View>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Chest (cm)"
              value={formState.progress_circumference_chest?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_circumference_chest', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_circumference_chest', value);
                  }
                }
              }}
            />
            <View className="flex flex-row justify-between items-center w-[55%]">
              <Text className="text-left ml-[5px]">Waist</Text>
              <TooltipButton guideName="Waist" />
            </View>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Waist (cm)"
              value={formState.progress_circumference_waist?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_circumference_waist', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_circumference_waist', value);
                  }
                }
              }}
            />
            <View className="flex flex-row justify-between items-center w-[55%]">
              <Text className="ml-[5px]">Thigh left</Text>
              <TooltipButton guideName="Thigh" />
            </View>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Thigh Left (cm)"
              value={formState.progress_circumference_thigh_l?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_circumference_thigh_l', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_circumference_thigh_l', value);
                  }
                }
              }}
            />
            <View className="flex flex-row justify-between items-center w-[55%]">
              <Text className="ml-[5px]">Thigh Right</Text>
              <TooltipButton guideName="Thigh" />
            </View>
            <TextInput
              keyboardType="numeric"
              className="p-2.5 border-gray-500 bg-gray-200 border w-[90%] rounded-lg m-1"
              placeholder="Thigh Right (cm)"
              value={formState.progress_circumference_thigh_r?.toString()}
              onChangeText={(value) => {
                if (value === '') {
                  handleChange('progress_circumference_thigh_r', value);
                } else {
                  const numericValue = parseFloat(value);
                  if (numericValue <= 999) {
                    handleChange('progress_circumference_thigh_r', value);
                  }
                }
              }}
            />
            <Text className="ml-[5px]">Date</Text>
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
          className="bg-indigo-500 p-2 rounded-lg w-1/2 self-center m-1.5"
        >
          <Text className="text-white font-bold text-lg text-center">
            Upload Progress
          </Text>
        </TouchableOpacity>
        <Toast config={toastConfig} />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default AddProgress;
