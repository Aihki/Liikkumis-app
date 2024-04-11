import {User, UserWithNoPassword, UserWorkout} from './DBTypes';
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
  AddWorkoutScreen: {onWorkoutAdded: () => void};

  AdminScreen: { refresh?: boolean };

  WorkoutDetails: {
    workoutId: number;
    workoutInfo?: UserWorkout;
    refresh?: boolean;
  };

  WorkoutHistoryScreen: { userId: number; refresh?: boolean};

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
