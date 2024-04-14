import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { useUserContext } from '../hooks/ContextHooks';
import Challenges from '../components/challenge/Challenges';


const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {

  const { handleLogout } = useUserContext();

  return (
    <View className='pt-20 items-center'>
      <TouchableOpacity
        className='className="px-4 py-2 bg-blue-500 rounded-xl w-[90%]'
        onPress={() => navigation.navigate('Challenges')}
      >
        <Text className='text-white text-center font-semibold'>Challenges</Text>
      </TouchableOpacity>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
