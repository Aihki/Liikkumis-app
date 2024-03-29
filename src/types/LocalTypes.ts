import {User, UserWithNoPassword} from './DBTypes';
export type Credentials = Pick<User, 'username' | 'password'>;
/* export { Credentials }; */

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};

export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;
  Login: undefined;
  WorkoutDetails: { workoutId: number; refresh?: boolean };
  EditWorkoutScreen: { workoutId: number; refresh?: boolean };
  AddExerciseScreen: { workoutId: number; refresh?: boolean };
  EditExerciseScreen: { exerciseId: number; refresh?: boolean };
};

