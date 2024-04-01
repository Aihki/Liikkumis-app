import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Login from '../views/Login';
import {useUserContext} from '../hooks/ContextHooks';
import FoodDiary from '../views/FoodDiary';
import Exercise from '../views/Exercise';
import Upload from '../views/Upload';


export type RootStackParamList = {
  FoodDiary: undefined;
  FoodDetailScreen: undefined;
  // Define other screens here
};

const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="FoodDiary" component={FoodDiary} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
const StackNavigator = () => {
  const {user} = useUserContext();
  return (
    <stack.Navigator>
      {user ? (
        <>
          <stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <stack.Screen name="FoodDiary" component={FoodDiary} />
          <stack.Screen name="Exercise" component={Exercise} />
          <stack.Screen name="Upload" component={Upload} />

        </>
      ) : (
        <stack.Screen name="Login" component={Login} />
      )}
    </stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
