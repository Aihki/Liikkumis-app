import React, { useEffect, useRef } from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { useUserContext } from '../hooks/ContextHooks';
import Challenges from '../components/challenge/Challenges';
import LottieView from 'lottie-react-native';


const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const bicepRef = useRef<LottieView | null>(null);
  const { handleLogout } = useUserContext();
  useEffect(() => {
    if (bicepRef.current) {
      bicepRef.current.play();
    }
  }, []);

  return (
    <View className='pt-20 items-center'>

<Text className=' text-2xl font-bold text-center mb-4'>Welcome to LiikkumisApp!</Text>
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


<View className='bg-gray-200 p-4 rounded-lg my-4 border-2 mx-2'>

      <Text className='text-base font-bold text-center my-2'>
    Here's what you can do!{'\n'}
  </Text>
  <Text className='text-sm'>
    - Create and track your workouts in the exercise page.{'\n'}
  </Text>
  <Text className='text-sm'>
    - Create meal plans to follow in the food diary.{'\n'}
  </Text>
  <Text className='text-sm'>
    - Track your progress on your profile.{'\n'}
  </Text>
  <Text className='text-sm'>
    - And finally, see your challenges here on the home page!{'\n'}
  </Text>
    </View>
                     <TouchableOpacity
        className='className="px-4 py-2 bg-blue-500 rounded-md w-[95%]'
        onPress={() => navigation.navigate('Challenges')}
      >

        <Text className='text-white text-center font-semibold'>Challenges</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
