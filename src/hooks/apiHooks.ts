import * as FileSystem from 'expo-file-system';
import {useState, useEffect} from 'react';
import {fetchData} from '../lib/utils';
import {Credentials} from '../types/LocalTypes';
import {
  ExerciseApiResponse,
  LoginResponse,
  MessageResponse,
  PersonalBestSuccessResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {useUpdateContext} from './UpdateHooks';
import {Exercise, FoodDiary, UserProgress, UserWorkout} from '../types/DBTypes';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import the AsyncStorage module

const useUserProgress = () => {
  const getUserProgress = async (id: number) => {
    return await fetchData<UserProgress[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/progress/' + id,
    );
  };

  const postProgress = async (progress: UserProgress) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/progress/',
      options,
    );
  };
  const putProgress = async (progress: UserProgress) => {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/progress/' + progress.user_id,
      options,
    );
  };
  return {getUserProgress, postProgress, putProgress};
};

const useExcersise = () => {
  const getUserExercises = async (id: number, token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises/' + id,
      options,
    );
  };

  const getDefailtExercises = async () => {
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises',
    );
  };

  const getUserSpecificExercises = async (id: number, exerciseId: number, token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/exercises/' +
        id +
        '/' +
        exerciseId,
      options,
    );
  };
  const putSpecificExercise = async (id: number, exercises: Exercise) => {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercises),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/exercises/' +
        id +
        '/' +
        exercises.exercise_id,
      options,
    );
  };

  const getUsersExcersisesByWorkoutId = async (
    user_id: number,
    user_workout_id: number,
    token: string,
  ) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/exercises/' +
        user_id +
        '/workout/' +
        user_workout_id,
      options,
    );
  };

  const addExercise = async (id: number, exercises: Omit<Exercise, "exercise_id" | "created_at">, token: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(exercises),
    };
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises/' + id,
      options,
    );
  };

  const deleteExercise = async (id: number, exerciseId: number, token: string) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/exercises/' +
        id +
        '/' +
        exerciseId,
      options,
    );
  };

  const getPersonalBestByExerciseName = async (id: number, exerciseName: string, token: string ): Promise<PersonalBestSuccessResponse> => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/exercises/' +
        id +
        '/personal-best/' +
        exerciseName,
      options,
    );
  };

  return {
    getUserExercises,
    getUserSpecificExercises,
    getDefailtExercises,
    putSpecificExercise,
    getUsersExcersisesByWorkoutId,
    addExercise,
    deleteExercise,
    getPersonalBestByExerciseName
  };
};
const useUserFoodDiary = () => {
  const getUserFoodDiary = async (id: number) => {
    return await fetchData<FoodDiary[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/fooddiary/' + id,
    );
  };
  const postFoodDiary = async (id: number, foodDiary: FoodDiary) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodDiary),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/fooddiary/' + id,
      options,
    );
  }
  const saveMealToDatabase = async (userId: number, meal: FoodDiary) => {
    // Directly use FoodDiary type without conversion as it's already in the right shape
    return await postFoodDiary(userId, meal);
  };
  const putFoodDiary = async (id:number, foodDiary: FoodDiary) => {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodDiary),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/fooddiary/' + id,
      options,
    );
  }
  const deleteFoodDiary = async (userId: number, foodDiaryId: number) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the stored token
      const options: RequestInit = {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      };

      const response = await fetchData<MessageResponse>(
        `${process.env.EXPO_PUBLIC_TRAINING_SERVER}/fooddiary/${userId}/${foodDiaryId}`,
        options,
      );

      return response;
    } catch (error) {
      console.error('Error deleting food diary entry:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };
  return {getUserFoodDiary, postFoodDiary, putFoodDiary, deleteFoodDiary, saveMealToDatabase};
};

const useWorkouts = () => {
  const getWorkouts = async () => {
    return await fetchData<UserWorkout[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts',
    );
  };
  const getUserWorkouts = async (id: number, token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<UserWorkout[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/' + id,
      options,
    );
  };

  const getUserWorkoutByWorkoutId = async (id: number, workout_id: number, token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<UserWorkout>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/' + workout_id + '/' + id,
      options,
    );
  };

  const postWorkout = async (
    workout: Omit<UserWorkout, 'created_at' | 'user_workout_id'>,
    token: string,
  ) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(workout),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts',
      options,
    );
  };
  const putWorkout = async (workout:  Omit<UserWorkout, 'created_at'>, token: string) => {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(workout),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/' + workout.user_workout_id,
      options,
    );
  };
  const deleteWorkout = async (id: number, workout_id: number, token: string) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER +
        '/workouts/' +
        id +
        '/' +
        workout_id,
      options,
    );
  };
  return {getWorkouts, getUserWorkouts, getUserWorkoutByWorkoutId, postWorkout, putWorkout, deleteWorkout};
};

const useUser = () => {
  const getUserByToken = async (token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_SERVER + '/users/token',
      options,
    );
  };

  const postUser = async (user: Record<string, string>) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
    await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_SERVER + '/users/',
      options,
    );
  };

  const getUsernameAvailability = async (username: string) => {
    return fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_SERVER + '/users/username/' + username,
    );
  };

  const getEmailAvailable = async (email: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_SERVER + '/users/email/' + email,
    );
  };
  return {getUserByToken, postUser, getUsernameAvailability, getEmailAvailable};
};

const useAuthentication = () => {
  const postLogin = async (creds: Credentials) => {
    return await fetchData<LoginResponse>(
      process.env.EXPO_PUBLIC_AUTH_SERVER + '/auth/login',
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

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };
    return await fetchData<UploadResponse>(
      process.env.EXPO_PUBLIC_UPLOAD_SERVER + '/upload',
      options,
    );
  };

  const postExpoFile = async (
    imageUri: string,
    token: string,
  ): Promise<UploadResponse> => {
    const fileResult = await FileSystem.uploadAsync(
      process.env.EXPO_PUBLIC_UPLOAD_SERVER + '/upload',
      imageUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
    return JSON.parse(fileResult.body);
  };
  return {postFile, postExpoFile};
};

export {
  useUser,
  useAuthentication,
  useFile,
  useWorkouts,
  useUserFoodDiary,
  useUserProgress,
  useExcersise,
};
