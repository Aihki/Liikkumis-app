import * as FileSystem from 'expo-file-system';
import { useState, useEffect } from 'react';
import {fetchData} from '../lib/utils';
import {Credentials} from '../types/LocalTypes';
import {
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {useUpdateContext} from './UpdateHooks';


const useUserProgress = () => {};
const useExcersise = () => {};
const useUserFoodDiary = () => {};
const useWorkouts = () => {};

const useUser = () => {
 const getUserByToken = async (token: string) => {
  const options: RequestInit = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  return await fetchData<UserResponse>(
    process.env.EXPO_PUBLIC_AUTH_API + '/users/token',
    options,
  );
}

const postUser = async (user: Record<string, string>)=> {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };
  await fetchData<UserResponse>(
    process.env.EXPO_PUBLIC_AUTH_API + '/users/',
    options,
  );
};

const getUsernameAvailability = async (username: string) => {
return  fetchData<{available: boolean}>(
    process.env.EXPO_PUBLIC_AUTH_API + '/users/username/' + username,
  );
};

const getEmailAvailable = async (email: string) => {
  return await fetchData<{available: boolean}>(
    process.env.EXPO_PUBLIC_AUTH_API + '/users/email/' + email,
  );
};
return {getUserByToken, postUser, getUsernameAvailability, getEmailAvailable};
};

const useAuthentication = () => {
  const postLogin = async (creds: Credentials) => {
    return await fetchData<LoginResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/auth/login',
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
      process.env.EXPO_PUBLIC_UPLOAD_API + '/upload',
      options,
    );
  };

  const postExpoFile = async (imageUri: string, token: string): Promise<UploadResponse> => {
    const fileResult = await FileSystem.uploadAsync(
      process.env.EXPO_PUBLIC_UPLOAD_API + '/upload',
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

export {useUser, useAuthentication, useFile};
