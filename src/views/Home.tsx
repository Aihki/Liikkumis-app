import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import { useUserContext } from '../hooks/ContextHooks';
import { Calendar } from 'react-native-calendars';
import LottieView from 'lottie-react-native';
import { useExercise } from '../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";


interface Activity {
  workout_date: string;
  workout_type: string;
  workout_name: string;
  total_exercises: number;
}

interface MarkedDates {
  [date: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

const Home = ({ navigation }: { navigation: NavigationProp<ParamListBase> }) => {
  const { user } = useUserContext();
  const { getActivity } = useExercise();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [modalVisible, setModalVisible] = useState(false);

  const formatActivitiesForCalendar = (activities: Activity[]): MarkedDates => {
    const marks: MarkedDates = {};
    activities.forEach(activity => {
      const adjustedDate = formatDate(activity.workout_date);
      marks[adjustedDate] = { selected: true, selectedColor: '#6366f1' };
    });
    return marks;
  };

  const loadActivities = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) {
      return;
    }

    const response = await getActivity(user.user_id, token);
    if (response) {
      setActivities(response);
      const newMarkedDates = formatActivitiesForCalendar(response);
      setMarkedDates(newMarkedDates);
    }
    console.log(response);
  };

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    date.setUTCDate(date.getUTCDate() + 1);  // Adding one day

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;  // Months are zero-indexed, add one to normalize
    const day = date.getUTCDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  const bicepRef = useRef<LottieView | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
      if (bicepRef.current) {
        bicepRef.current.play();
      }
    }, [])
  )

  return (

    <ScrollView  className=''>
      <View className='items-center'>
        <View style={{
          paddingTop: 50,
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 10,
            backgroundColor: 'white'
        }}>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', margin: 10 }}>
          Welcome to LiikkumisApp!
        </Text>
      </View>
        <LottieView
          source={require('../assets/animations/bicep.json')}
          ref={bicepRef}
          loop={true}
          autoPlay={true}
          style={{
            width: 200,
            height: 200,
            backgroundColor: 'transparent',
          }}
        />
      </View>
      <View className='items-center border-y pt-3 pb-3 border-gray-200'>
        <View className='w-[87%]  bg-white rounded-lg border border-t border-gray-50 shadow-lg shadow-indigo-200   relative'>
          <Text className='text-center mt-4 mb-2 text-[18px]'>Monthly Activity</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
          >
            <View className="absolute right-4 -top-[30px]">
            <FontAwesomeIcon
              icon={faCircleInfo}
              size={20}
            />
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View className="bg-white border-b border-gray-50 p-3 pt-10 items-center h-[32%]">
              <View className="flex flex-col gap-4">
                  <Text className="text-center text-[20px] font-bold mb-2">Monthly Activity Calendar:</Text>
                  <Text className="text-[16px]">This calendar displays your activity history for the month.</Text>
                  <Text className="text-[16px]">Days marked in blue show when you recorded exercises.</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    className="pt-4"
                  >
                      <View className="bg-indigo-500 p-2 rounded-md">
                          <Text className="text-center text-white font-bold text-[16px]">Close</Text>
                      </View>
                  </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Calendar
            className='text-center bg-gray-50'
            showWeekNumbers={false}
            hideArrows={true}
            hideExtraDays={true}
            disableMonthChange={true}
            markedDates={markedDates}
            theme={{
              todayTextColor: '#00adf5',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayButtonTextColor: '#00adf5',
              textDisabledColor: '#d9e1e8',
            }}
          />
        </View>
      </View>
      <View className='items-center mb-2'>
        <TouchableOpacity
          className='px-4 py-2 bg-indigo-500 rounded-md w-[85%]'
          onPress={() => navigation.navigate('Challenges')}
        >
          <Text className='text-white text-center font-semibold'>Challenges</Text>
        </TouchableOpacity>
      </View>
      <View className='bg-gray-200 p-4 rounded-lg mt-5 mb-7 border-2 mx-2'>
        <Text className='text-base font-bold text-center my-2'>Here's what you can do!{'\n'}</Text>
        <Text className='text-sm'>- Create and track your workouts in the exercise page.{'\n'}</Text>
        <Text className='text-sm'>- Create meal plans to follow in the food diary.{'\n'}</Text>
        <Text className='text-sm'>- Track your progress on your profile.{'\n'}</Text>
        <Text className='text-sm'>- And finally, see your challenges here on the home page!{'\n'}</Text>
      </View>

    </ScrollView>
  );
};

export default Home;
