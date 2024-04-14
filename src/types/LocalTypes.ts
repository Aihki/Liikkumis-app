import {User, UserWithNoPassword, UserWorkout} from './DBTypes';
export type Credentials = Pick<User, 'username' | 'password'>;


export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
  handleReloadUser: () => void;
};

export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;
  Login: undefined;
  FoodDiary: undefined;
  FoodDetailScreen: undefined;
  AddWorkoutScreen: {onWorkoutAdded: () => void};
  CompareProgress: undefined;
  AddProgress: undefined;
  ProfilePic: undefined;

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

  Challenges: undefined;

  ChallengeDetails: {
    challengeId: number;
    refresh?: boolean;
  };

  YourChallenges: {
    userId: number;
    refresh?: boolean;
  };
};


export type ExerciseProps = {
  workout: UserWorkout;
  workoutId: number;
}
