import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp, createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Login from '../views/Login';
import {useUserContext} from '../hooks/ContextHooks';
import FoodDiary from '../views/FoodDiary';
import Exercise from '../views/Exercise';
import { RootStackParamList } from '../types/LocalTypes';
import WorkoutDetails from '../components/workout/WorkoutDetails';
import AddExerciseScreen from '../components/workout/AddExerciseScreen';
import EditWorkoutScreen from '../components/workout/EditWorkoutScreen';
import AddWorkoutScreen from '../components/workout/AddWorkoutScreen';
import ExerciseInfoScreen from '../components/workout/ExerciseInfoScreen';
import WorkoutHistoryScreen from '../components/workout/WorkoutHistoryScreen';
import AdminScreen from '../components/admin/AdminScreen';
import ProfilePic from '../components/profile/ProfilePic';
import addProgress from '../components/profile/AddProgress';
import CompareProgress from '../components/profile/CompareProgress';
import Challenges from '../components/challenge/Challenges';
import ChallengeDetails from '../components/challenge/ChallengeDetails';
import YourChallenges from '../components/challenge/YourChallenges';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import CustomTabButton from '../components/CustomTabButton';
import Workouts from '../components/workout/Workouts';


const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator<RootStackParamList>();


const TabNavigator = () => {
  const { user } = useUserContext();


  // If user is an admin, return null because we don't want to render tabs for admin
  if (user?.user_level_id === 1) {
    return null;
  }

  // For non-admin users, return the usual TabNavigator with tabs
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          backgroundColor: '#fff',
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#9ef09e',
        tabBarInactiveTintColor: '#d3d3d3',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name='home'
              size={30}
              color={focused ? '#9ef09e' : '#b3b3b3'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name='person'
              size={30}
              color={focused ? '#9ef09e' : '#b3b3b3'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddWorkout"
        component={View} // Empty view, since navigation is handled by the button
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="plus" size={42} color={focused ? "#4ade80" : "grey"} />
          ),
          tabBarButton: (props) => (
            <CustomTabButton {...props}>
              <Entypo name="plus" size={42} color="white" />
            </CustomTabButton>
          )
        }}
      />
      {user && (
        <>
          <Tab.Screen
            name="FoodDiary"
            component={FoodDiary}
            options={{
              tabBarIcon: ({ focused }) => (
                <MaterialCommunityIcons
                  name="food-variant"
                  size={30}
                  color={focused ? '#9ef09e' : '#b3b3b3'}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Exercise"
            component={Exercise}
            options={{
              tabBarIcon: ({ focused }) => (
                <MaterialIcons
                  name="fitness-center"
                  size={30}
                  color={focused ? '#9ef09e' : '#b3b3b3'}
                />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};


const StackNavigator = () => {
  const { user } = useUserContext();

  return (
    <stack.Navigator>
      {user ? (
        user?.user_level_id == 1 ? (


          <>
            <stack.Screen name="AdminScreen" component={AdminScreen} options={{ headerShown: false }} />
            {/* You can add more admin-specific screens here */}
          </>
        ) : (

          <>
            <stack.Screen
              name="Tabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <stack.Screen name="AddWorkoutScreen" component={AddWorkoutScreen} />
            <stack.Screen name="WorkoutDetails" component={WorkoutDetails} />
            <stack.Screen name="WorkoutHistoryScreen" component={WorkoutHistoryScreen} />
            <stack.Screen name="EditWorkoutScreen" component={EditWorkoutScreen} />
            <stack.Screen name="AddExerciseScreen" component={AddExerciseScreen} />
            <stack.Screen name="ExerciseInfoScreen" component={ExerciseInfoScreen} />
            <stack.Screen name="ProfilePic" component={ProfilePic} />
            <stack.Screen name="AddProgress" component={addProgress} />
            <stack.Screen name="CompareProgress" component={CompareProgress} />
            <stack.Screen name="Challenges" component={Challenges} />
            <stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
            <stack.Screen name="YourChallenges" component={YourChallenges} />
          </>
        )
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
