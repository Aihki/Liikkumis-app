import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Login from '../views/Login';
import {useUserContext} from '../hooks/ContextHooks';
import FoodDiary from '../views/FoodDiary';
import Exercise from '../views/Exercise';
import Upload from '../views/Upload';
import WorkoutDetails from '../components/WorkoutDetails';
import { RootStackParamList } from '../types/LocalTypes';


const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator<RootStackParamList>();


const TabNavigator = () => {
  const { user } = useUserContext();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      {user && (
        <>
          <Tab.Screen name="FoodDiary" component={FoodDiary} />
          <Tab.Screen name="Exercise" component={Exercise} />
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
          <stack.Screen name="WorkoutDetails" component={WorkoutDetails} />
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
