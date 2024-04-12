import {User, UserWithNoPassword, UserWorkout} from './DBTypes';
export type Credentials = Pick<User, 'username' | 'password'>;
/* export { Credentials }; */

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
  handleReloadUser: () => void;
};


export type RootStackParamList = {
  CompareProgress: undefined;
  AddProgress: undefined;
  ProfilePic: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;
  Login: undefined;
  FoodDiary: undefined;
  FoodDetailScreen: undefined;
  AddWorkoutScreen: {onWorkoutAdded: () => void};

  WorkoutDetails: {
    workoutId: number;
    workoutInfo?: UserWorkout;
    refresh?: boolean;
  };

  ProfilePic: undefined;

  EditWorkoutScreen: {workoutId: number; refresh?: boolean};

  AddExerciseScreen: {
    workoutId: number;
    workoutInfo: UserWorkout;
    refresh?: boolean;
  };
  ExerciseInfoScreen: {
    exerciseId: number;
    refresh?: boolean;
  };
};

export type ExerciseProps = {
  workout: UserWorkout;
  workoutId: number;
}
