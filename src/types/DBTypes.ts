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
  created_at: Date;
};

type FoodDiary = {
  foodDiary_id?: number;
  user_id: number;
  food_diary_date: string;
  food_diary_notes: string;
  food_diary_ingredients: string;
  food_diary_meal: string;
  food_diary_calories: number;
  created_at: Date;
};

type UserWorkout = {
  user_workout_id: number;
  user_id: number;
  workout_type: string;
  workout_date: string;
  workout_name: string;
  workout_description: string;
  created_at?: Date;
};

type Exercise = {
  exercise_id: number;
  user_id: number;
  user_workout_id: number;
  exercise_name: string;
  exercise_weight: number;
  exercise_reps: number;
  exercise_sets: number;
  exercise_duration: number;
  exercise_distance: number;
  created_at: Date;
};

type PersonalBest = {
  pb_id: number;
  user_id: number;
  exercise_name: string;
  max_weight: number;
  record_date: Date;
  created_at: Date;
};

type UserProgress = {
  progress_id: number;
  user_id: number;
  progress_date: Date;
  progress_weight: number;
  progress_height: number;
  progress_circumference_chest: number;
  progress_circumference_waist: number;
  progress_circumference_thigh_r: number;
  progress_circumference_thigh_l: number;
  progress_circumference_bicep_r: number;
  progress_circumference_bicep_l: number;
  progress_circumference_calves_r: number;
  progress_circumference_calves_l: number;
};

type UserWithLevel = Omit<User, 'user_level_id'> &
  Pick<UserLevel, 'level_name'>;

type UserWithNoPassword = Omit<UserWithLevel, 'password'>;

type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

// for upload server
type FileInfo = {
  user_profile_pic: string;
  user_id: number;
};

export type {
  UserLevel,
  User,
  FoodDiary,
  UserWorkout,
  Exercise,
  PersonalBest,
  UserProgress,
  UserWithLevel,
  UserWithNoPassword,
  TokenContent,
  FileInfo,
};
