import * as FileSystem from 'expo-file-system';
import {fetchData} from '../lib/utils';
import {Credentials} from '../types/LocalTypes';
import {
  ExerciseApiResponse,
  LoginResponse,
  MessageResponse,
  PersonalBestCompareResponse,
  PersonalBestSuccessResponse,
  UploadResponse,
  UserResponse,
  WorkoutStatusResponse,
} from '../types/MessageTypes';
import {useUpdateContext} from './UpdateHooks';
import {
  Challenge,
  CombinedChallenge,
  Exercise,
  FoodDiary,
  PersonalBest,
  User,
  UserChallenge,
  UserProgress,
  UserWorkout,
} from '../types/DBTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserProgress = () => {
  const getUserProgress = async (id: number) => {
    return await fetchData<UserProgress[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/progress/${id}`,
    );
  };

  const getUserProgressByDate = async (id: number, date: string) => {
    console.log('date', date);
    return await fetchData<UserProgress[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/progress/' + id + '/' + date,
    );
  };

  const postProgress = async (
    progress: Omit<UserProgress, 'progress_id' | 'created_at'>,
    userId: number,
  ) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/progress/' + userId,
      options,
    );
  };

  const putProgress = async (progress: UserProgress) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/progress/${progress.user_id}`,
      options,
    );
  };
  return {getUserProgress, postProgress, putProgress, getUserProgressByDate};
};

const useExercise = () => {
  const getUserExercises = async (id: number, token: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<Exercise[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises/${id}`,
      options,
    );
  };

  const getDefaultExercises = async () => {
    return await fetchData<Exercise[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises`,
    );
  };

  const getUserSpecificExercises = async (
    id: number,
    exerciseId: number,
    token: string,
  ) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<Exercise[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises/${id}/${exerciseId}`,
      options,
    );
  };

  const putSpecificExercise = async (
    id: number,
    exercises: Exercise,
    token: string,
  ) => {
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercises),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises/${id}/${exercises.exercise_id}`,
      options,
    );
  };

  const getUsersExercisesByWorkoutId = async (
    user_id: number,
    user_workout_id: number,
    token: string,
  ) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<Exercise[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises/${user_id}/workout/${user_workout_id}`,
      options,
    );
  };

  const addExercise = async (
    id: number,
    exercise: Omit<Exercise, 'exercise_id' | 'created_at'>,
    token: string,
  ) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exercise),
    };
    return await fetchData<Exercise[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises/${id}`,
      options,
    );
  };

  const deleteExercise = async (
    id: number,
    exerciseId: number,
    token: string,
  ) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises/${id}/${exerciseId}`,
      options,
    );
  };

  const markExerciseAsDone = async (
    id: number,
    exerciseId: number,
    token: string,
  ) => {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/exercises/' +
        id +
        '/done/' +
        exerciseId,
      options,
    );
  };

  const getPersonalBestByExerciseName = async (
    id: number,
    exerciseName: string,
    token: string,
  ): Promise<PersonalBestSuccessResponse> => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetchData<PersonalBestSuccessResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises/${id}/personal-best/${exerciseName}`,
      options,
    );
  };

  const comparePersonalBest = async (
    userId: number,
    exerciseName: string,
    token: string,
  ): Promise<any> => {
    // Consider defining a type for the response
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return await fetchData<PersonalBestCompareResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/exercises/${userId}/compare-pb/${exerciseName}`,
      options,
    );
  };

  const getPersonalBestForProfile = async (userId: number, token: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<PersonalBest[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/exercises/' +
        userId +
        '/profile/personal-best',
      options,
    );
  };

  interface Activity {
    workout_date: string;
    workout_type: string;
    workout_name: string;
    total_exercises: number;
  }

  const getActivity = async (id: number, token: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
      return await fetchData<Activity[]>(
        process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises/' + id + '/activity',
        options,
      );
  };

  return {
    getUserExercises,
    getUserSpecificExercises,
    getDefaultExercises,
    putSpecificExercise,
    getUsersExercisesByWorkoutId,
    addExercise,
    deleteExercise,
    markExerciseAsDone,
    getPersonalBestByExerciseName,
    comparePersonalBest,
    getPersonalBestForProfile,
    getActivity
  };
};

const useUserFoodDiary = () => {
  const getUserFoodDiary = async (id: number) => {
    return await fetchData<FoodDiary[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/fooddiary/${id}`,
    );
  };

  const postFoodDiary = async (id: number, foodDiary: FoodDiary) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodDiary),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/fooddiary/${id}`,
      options,
    );
  };

  const putFoodDiary = async (id: number, foodDiary: FoodDiary) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodDiary),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/fooddiary/${id}`,
      options,
    );
  };

  const deleteFoodDiary = async (userId: number, foodDiaryId: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      },
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/fooddiary/${userId}/${foodDiaryId}`,
      options,
    );
  };

  return {getUserFoodDiary, postFoodDiary, putFoodDiary, deleteFoodDiary};
};

const useWorkouts = () => {
  const getWorkouts = async () => {
    return await fetchData<UserWorkout[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/workouts`,
    );
  };

  const getUserWorkouts = async (id: number, token: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<UserWorkout[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/workouts/user/${id}`,
      options,
    );
  };

  const getUserWorkoutByWorkoutId = async (
    id: number,
    workout_id: number,
    token: string,
  ) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<UserWorkout>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/workouts/${workout_id}/${id}`,
      options,
    );
  };

  const postWorkout = async (
    workout: Omit<
      UserWorkout,
      'created_at' | 'user_workout_id' | 'workout_status'
    >,
    token: string,
  ) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workout),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/workouts`,
      options,
    );
  };
  const putWorkout = async (
    workout: Omit<UserWorkout, 'created_at' | 'workout_status'>,
    token: string,
  ) => {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workout),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/workouts/${workout.user_workout_id}`,
      options,
    );
  };

  const deleteWorkout = async (
    id: number,
    workout_id: number,
    token: string,
  ) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/workouts/${id}/${workout_id}`,
      options,
    );
  };
  const setWorkoutStatusToCompleted = async (
    workout_id: number,
    token: string,
  ) => {
    const options = {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/workouts/completed/' +
        workout_id,
      options,
    );
  };
  const getCompletedWorkouts = async (id: number, token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<UserWorkout[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/completed/' + id,
      options,
    );
  };
  const getWorkoutStatus = async (
    id: number,
    workout_id: number,
    token: string,
  ) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<WorkoutStatusResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/workouts/status/' +
        id +
        '/' +
        workout_id,
      options,
    );
  };

  const getCompletedWorkoutsCount = async (token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<{count: number}>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/completed/count',
    );
  };
  const getMostPopularWorkoutType = async (
    token: string,
  ): Promise<Array<{workout_type: string; count: number}>> => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Array<{workout_type: string; count: number}>>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/popular/type',
    );
  };

  const getCompletedExercisesCountWhitWorkoutId = async (
    workoutId: number,
    userId: number,
    token: string,
  ) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<{count: number}>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/workouts/' +
        workoutId +
        '/user/' +
        userId +
        '/exercises/completed/count',
    );
  };

  return {
    getWorkouts,
    getUserWorkouts,
    getUserWorkoutByWorkoutId,
    postWorkout,
    putWorkout,
    deleteWorkout,
    setWorkoutStatusToCompleted,
    getCompletedWorkouts,
    getWorkoutStatus,
    getCompletedWorkoutsCount,
    getMostPopularWorkoutType,
    getCompletedExercisesCountWhitWorkoutId,
  };
};

const useUser = () => {
  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<UserResponse>(
      `${process.env.EXPO_PUBLIC_AUTH_SERVER}/users/token`,
      options,
    );
  };

  const postUser = async (user: Record<string, any>) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
    return await fetchData<UserResponse>(
      `${process.env.EXPO_PUBLIC_AUTH_SERVER}/users/`,
      options,
    );
  };

  const getUsernameAvailability = async (username: string) => {
    return await fetchData<{available: boolean}>(
      `${process.env.EXPO_PUBLIC_AUTH_SERVER}/users/username/${username}`,
    );
  };

  const getEmailAvailable = async (email: string) => {
    return await fetchData<{available: boolean}>(
      `${process.env.EXPO_PUBLIC_AUTH_SERVER}/users/email/${email}`,
    );
  };

  const getUsers = async () => {
    return await fetchData<User[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/users',
    );
  };

  const getUserCount = async () => {
    return await fetchData<{count: number}>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/users/count',
    );
  };

  const deleteUserAsAdmin = async (id: number, token: string) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_SERVER + '/users/' + id,
      options,
    );
  };

  return {
    getUserByToken,
    postUser,
    getUsernameAvailability,
    getEmailAvailable,
    getUsers,
    getUserCount,
    deleteUserAsAdmin,
  };
};

const useAuthentication = () => {
  const postLogin = async (creds: Credentials) => {
    return await fetchData<LoginResponse>(
      `${process.env.EXPO_PUBLIC_AUTH_SERVER}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds),
      },
    );
  };

  return {postLogin};
};

const useProfileUpdate = () => {
  const fetchProfilePic = async (id: number) => {
    return await fetchData<UserResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/users/picture/${id}`,
    );
  };

  const postPicture = async (id: number, picture: string, token: string) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({picture}),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/users/picture/${id}`,
      options,
    );
  };
  return {fetchProfilePic, postPicture};
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    return await fetchData<UploadResponse>(
      `${process.env.EXPO_PUBLIC_UPLOAD_SERVER}/upload`,
      options,
    );
  };

  const postExpoFile = async (imageUri: string, token: string) => {
    const fileResult = await FileSystem.uploadAsync(
      `${process.env.EXPO_PUBLIC_UPLOAD_SERVER}/upload`,
      imageUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return JSON.parse(fileResult.body);
  };
  return {postFile, postExpoFile};
};

const useChallenge = () => {
  const getChallenges = async () => {
    return await fetchData<Challenge[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge`,
    );
  };

  const getChallengeByChallengeId = async (id: number) => {
    return await fetchData<Challenge>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge/${id}`,
    );
  };

  const getChallengeByUserId = async (id: number) => {
    return await fetchData<CombinedChallenge[]>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge/user/${id}`,
    );
  };

  const postChallenge = async (
    challenge: Omit<Challenge, 'challenge_id'>,
    token: string,
  ) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(challenge),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge`,
      options,
    );
  };

  const putChallenge = async (challenge: Challenge, token: string) => {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(challenge),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge/${challenge.challenge_id}`,
      options,
    );
  };

  const deleteChallenge = async (challenge_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge/${challenge_id}`,
      options,
    );
  };

  const joinChallenge = async (
    challenge_id: number,
    user_id: number,
    token: string,
  ) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({user_id}),
    };
    return await fetchData<{success: boolean}>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge/${challenge_id}/join`,
      options,
    );
  };

  const leaveChallenge = async (
    challenge_id: number,
    user_id: number,
    token: string,
  ) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge/leave/${challenge_id}/${user_id}`,
      options,
    );
  };

  const checkIfUserIsInChallenge = async (
    challenge_id: number,
    user_id: number,
    token: string,
  ) => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData<{success: boolean; hasJoined: boolean}>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge/check/${challenge_id}/${user_id}`,
      options,
    );
  };

  const updateChallengeProgress = async (
    challenge_id: number,
    user_id: number,
    progress: number,
    token: string,
  ) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({progress}),
    };
    return await fetchData<MessageResponse>(
      `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/challenge/user/${user_id}/${challenge_id}/progress`,
      options,
    );
  };

  return {
    getChallenges,
    getChallengeByChallengeId,
    getChallengeByUserId,
    postChallenge,
    putChallenge,
    deleteChallenge,
    joinChallenge,
    leaveChallenge,
    checkIfUserIsInChallenge,
    updateChallengeProgress,
  };
};

export {
  useUser,
  useAuthentication,
  useFile,
  useWorkouts,
  useUserFoodDiary,
  useUserProgress,
  useExercise,
  useProfileUpdate,
  useChallenge,
};
