import { Exercise, UserWithNoPassword } from "./DBTypes";

type MessageResponse = {
    message: string;
  };

type ErrorResponse = MessageResponse & {
    stack?: string;
  };

// for auth server
type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UserWithNoPassword;
};

type UserResponse = MessageResponse & {
  user: UserWithNoPassword;
};

type UserDeleteResponse = MessageResponse & {
  user: { user_id: number };
};

type ExerciseApiResponse = {
  data: Exercise[];
  message?: string;
}

 type PersonalBestSuccessResponse = {
  max_weight: number;

};

type WorkoutStatusResponse = {
  workoutCompleted: boolean;
}

type PersonalBestCompareResponse = {
  average_max_weight: number;
  exercise_name: string;
  max_weight: number;
  percentage_above_average: number;
  user_id: number;
}

// for upload server
type UploadResponse = MessageResponse & {
  data: {
    user_profile_pic: string;
  };
};





export type {
    MessageResponse,
    ErrorResponse,
    LoginResponse,
    UserResponse,
    UserDeleteResponse,
    UploadResponse,
    ExerciseApiResponse,
    PersonalBestSuccessResponse,
    WorkoutStatusResponse,
    PersonalBestCompareResponse
};
