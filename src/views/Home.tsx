import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { useUserContext } from '../hooks/ContextHooks';


const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {

  const { handleLogout } = useUserContext();

  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
