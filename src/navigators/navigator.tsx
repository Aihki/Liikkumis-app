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


import { RootStackParamList } from '../types/LocalTypes';
import WorkoutDetails from '../components/WorkoutDetails';
import AddExerciseScreen from '../components/AddExerciseScreen';
import EditWorkoutScreen from '../components/EditWorkoutScreen';
import AddWorkoutScreen from '../components/AddWorkoutScreen';
import ExerciseInfoScreen from '../components/ExerciseInfoScreen';
import ProfilePic from '../components/ProfilePic';
import addProgress from '../components/AddProgress';
import CompareProgress from '../components/CompareProgress';




const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator<RootStackParamList>();


const TabNavigator = () => {
  const { user } = useUserContext();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <Tab.Screen name="Profile" component={Profile} options={{headerShown: false}} />
      {user && (
        <>
          <Tab.Screen name="FoodDiary" component={FoodDiary} options={{headerShown: false}}/>
          <Tab.Screen name="Exercise" component={Exercise}  options={{headerShown: false}}/>
        </>
      )}
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
            options={{ headerShown: false }}
          />
          <stack.Screen name="AddWorkoutScreen" component={AddWorkoutScreen} />
          <stack.Screen name="WorkoutDetails" component={WorkoutDetails} />
          <stack.Screen name="EditWorkoutScreen" component={EditWorkoutScreen} />
          <stack.Screen name="AddExerciseScreen" component={AddExerciseScreen} />
          <stack.Screen name="ExerciseInfoScreen" component={ExerciseInfoScreen} />
          <stack.Screen name="ProfilePic" component={ProfilePic} />
          <stack.Screen name="AddProgress" component={addProgress} />
          <stack.Screen name="CompareProgress" component={CompareProgress} />
          </>
      ) : (
        <stack.Screen name="Login" component={Login} options={{headerShown: false}} />
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
