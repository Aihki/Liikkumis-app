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

// for upload server
type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
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
    PersonalBestSuccessResponse
};
