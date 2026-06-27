export interface Exercise {

  id: string;

  activity: string;

  duration: number;

  caloriesBurned: number;

  createdAt: string;
}

export interface CreateExerciseDTO {

  activity: string;

  duration: number;

  caloriesBurned: number;
}

export interface UpdateExerciseDTO {

  activity: string;

  duration: number;

  caloriesBurned: number;
}