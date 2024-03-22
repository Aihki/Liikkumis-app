type UserLevel = {
  level_id: number;
  level_name: string;
};

type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number | null;
  user_profile_pic: string | null;
  user_banner_pic: string | null;
  createdAt: Date;
};

type FoodDiary = {
  foodDiary_id: number;
  user_id: number;
  food_diary_date: Date;
  food_diary_meal: string;
  food_diary_calories: number;
  createdAt: Date;
};

  type UserWorkout = {
  user_workout_id: number;
  user_id: number;
  workout_date: Date;
  workout_name: string;
  workout_description: string;
  createdAt: Date;
};

type Exercise = {
  exercise_id: number;
  user_id: number;
  user_workout_id: number;
  exercise_name: string;
  exercise_weight: number;
  exercise_reps: number;
  createdAt: Date;
};

type UserProgress = {
  progress_id: number;
  user_id: number;
  progress_date: Date;
  progress_weight: number;
  progress_height: number;
  progress_circumference_chest: number;
  progress_circumference_waist: number;
  progress_circumference_thighR: number;
  progress_circumference_thighL: number;
  progress_circumference_bicepR: number;
  progress_circumference_bicepL: number;
  progress_circumference_calvesR: number;
  progress_circumference_calvesL: number;
};

type UserWithLevel = Omit<User, 'user_level_id'> &
Pick<UserLevel, 'level_name'>;

type UserWithNoPassword = Omit<UserWithLevel, 'password'>;

type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

// for upload server
type FileInfo = {
    filename: string;
    user_id: number;
};


export type {
    UserLevel,
    User,
    FoodDiary,
    UserWorkout,
    Exercise,
    UserProgress,
    UserWithLevel,
    UserWithNoPassword,
    TokenContent,
    FileInfo
  };
