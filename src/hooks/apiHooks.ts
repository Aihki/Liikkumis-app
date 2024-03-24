import * as FileSystem from 'expo-file-system';
import {useState, useEffect} from 'react';
import {fetchData} from '../lib/utils';
import {Credentials} from '../types/LocalTypes';
import {
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {useUpdateContext} from './UpdateHooks';
import {Exercise, UserWorkout} from '../types/DBTypes';

const useUserProgress = () => {};

const useExcersise = () => {

  const getUsersExcersisesById = async (user_id: string ,token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRANING_SERVER + '/excersises/' + user_id,
      options,
    );
  };

  const getUsersExcersisesByWorkoutId = async (user_id: string, user_workout_id: string ,token: string) => {
    const options: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRANING_SERVER + '/excersises/' + user_id + '/' + user_workout_id,
      options,
    );
  };

  const postExcersise = async (
    excersise: Omit<Exercise, 'user_excersise_id' | 'created_at'>,
    token: string,
  ) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(excersise),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRANING_SERVER + '/excersises',
      options,
    );
  };

  const removeExcersise = async (user_id: string, user_excersise_id: string, token: string) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRANING_SERVER + '/excersises/' + user_id + '/' + user_excersise_id,
      options,
    );
  };


  return { postExcersise, getUsersExcersisesById, getUsersExcersisesByWorkoutId, removeExcersise };
};

const useUserFoodDiary = () => {};

const useWorkouts = () => {
  const postWorkout = async (
    workout: Omit<UserWorkout, 'user_workout_id' | 'created_at'>,
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
      process.env.EXPO_PUBLIC_TRANING_SERVER + '/workouts',
      options,
    );
  };
  return { postWorkout };
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
      process.env.EXPO_PUBLIC_AUTH_SERVER + '/users',
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
  return { getUserByToken, postUser, getUsernameAvailability, getEmailAvailable };
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

  return { postLogin };
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
  return { postFile, postExpoFile };
};

export { useUser, useAuthentication, useFile, useWorkouts, useExcersise };
