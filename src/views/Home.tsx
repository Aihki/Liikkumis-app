import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { useUserContext } from '../hooks/ContextHooks';
import Challenges from '../components/Challenges';


const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {

  const { handleLogout } = useUserContext();

  return (
    <View className='pt-20'>
      <TouchableOpacity
        onPress={() => navigation.navigate('Challenges')}
      >
        <Text>Challenges</Text>
      </TouchableOpacity>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
