import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';


const Home = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {


  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
