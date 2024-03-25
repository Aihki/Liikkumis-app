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
import { Exercise, FoodDiary, UserProgress, UserWorkout } from '../types/DBTypes';


const useUserProgress = () => {
  const getUserProgress = async (id:number) => {
    return await fetchData<UserProgress[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/progress/' + id,
    );
  }

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
  }
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
  }
  return {getUserProgress, postProgress, putProgress};

};

const useExcersise = () => {
  const getUserExercises = async (id: number) => {
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises/' + id,
    );
  }
  const getUserSpecificExercises = async (id: number, exerciseId: number) => {
    return await fetchData<Exercise[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises/' + id + '/' + exerciseId,
    );
  }
  const putSpecificExercise = async (id:number, exercises:Exercise) => {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercises),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises/' + id + '/' + exercises.exercise_id,
      options,
    );
  }

  const addExercise = async (id:number, exercises:Exercise) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercises),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises/' + id,
      options,
    );
  }

  const deleteExercise = async (id:number, exerciseId:number) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/exercises/' + id + '/' + exerciseId,
      options,
    );
  }
  return {getUserExercises, getUserSpecificExercises, putSpecificExercise, addExercise, deleteExercise};
};
const useUserFoodDiary = () => {
  const getUserFoodDiary = async (id: number) => {
    return await fetchData<FoodDiary[]>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/fooddiary/' + id,
    );
  };
  const postFoodDiary = async (id:number, foodDiary: FoodDiary) => {
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
  const deleteFoodDiary = async (id:number, foodDiary_id:number) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_TRAINING_SERVER + '/fooddiary/' + id + '/' + foodDiary_id,
      options,
    );
  }
  return {getUserFoodDiary, postFoodDiary, putFoodDiary, deleteFoodDiary};
};
const useWorkouts = () => {
 const getWorkouts = async () => {
  return await fetchData<UserWorkout[]>(
    process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts',
  );
}
const getUserWorkouts = async (id:number) => {
  return await fetchData<UserWorkout[]>(
    process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/' + id,
  );
}
const postWorkout = async (workout: UserWorkout) => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workout),
  };
  return await fetchData<MessageResponse>(
    process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts',
    options,
  );
}
const putWorkout = async (workout: UserWorkout) => {
  const options: RequestInit = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workout),
  };
  return await fetchData<MessageResponse>(
    process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/' + workout.user_id,
    options,
  );
};
const deleteWorkout = async (id:number, workout_id: number) => {
  const options: RequestInit = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return await fetchData<MessageResponse>(
    process.env.EXPO_PUBLIC_TRAINING_SERVER + '/workouts/' + id + '/' + workout_id,
    options,
  );
  }
  return {getWorkouts, getUserWorkouts, postWorkout, putWorkout, deleteWorkout};
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

export {useUser, useAuthentication, useFile, useWorkouts, useUserFoodDiary, useUserProgress, useExcersise};
