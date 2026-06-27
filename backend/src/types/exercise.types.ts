// types/exercise.types.ts
export interface CreateExerciseDTO {
  activity: string;
  duration: number;      // em minutos
  caloriesBurned: number;
}

export interface UpdateExerciseDTO {
  activity?: string;
  duration?: number;
  caloriesBurned?: number;
}

export interface Exercise {
  id: string;
  activity: string;
  duration: number;
  caloriesBurned: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseWithUser extends Exercise {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ExerciseStats {
  totalExercises: number;
  totalCalories: number;
  totalDuration: number;
  averageCalories: number;
  averageDuration: number;
  mostFrequentActivity: string;
  caloriesPerMinute: number;
}

export interface ExerciseFilters {
  startDate?: Date;
  endDate?: Date;
  activity?: string;
  minDuration?: number;
  maxDuration?: number;
  minCalories?: number;
  maxCalories?: number;
}

export interface WeeklyExerciseSummary {
  week: number;
  year: number;
  totalExercises: number;
  totalDuration: number;
  totalCalories: number;
  activities: Record<string, {
    count: number;
    totalDuration: number;
    totalCalories: number;
  }>;
}

export enum ActivityType {
  RUNNING = "RUNNING",
  WALKING = "WALKING",
  CYCLING = "CYCLING",
  SWIMMING = "SWIMMING",
  WEIGHT_TRAINING = "WEIGHT_TRAINING",
  YOGA = "YOGA",
  HIIT = "HIIT",
  DANCING = "DANCING",
  SPORTS = "SPORTS",
  OTHER = "OTHER"
}

export interface ExerciseGoal {
  dailyCaloriesTarget?: number;
  weeklyCaloriesTarget?: number;
  dailyDurationTarget?: number;
  weeklyDurationTarget?: number;
  preferredActivities?: ActivityType[];
}