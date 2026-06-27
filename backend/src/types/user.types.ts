export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  height?: number;      // Opcional no cadastro
  weight?: number;      // Opcional no cadastro
  birthDate?: Date;     // Opcional no cadastro
  gender?: Gender;      // Opcional no cadastro
  goal?: Goal;          // Opcional no cadastro
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  height?: number;
  weight?: number;
  birthDate?: Date;
  gender?: Gender;
  goal?: Goal;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  height?: number | null;
  weight?: number | null;
  birthDate?: Date | null;
  gender?: Gender | null;
  goal?: Goal | null;
  createdAt: Date;
  _count?: {
    meals: number;
    exercises: number;
    meditations: number;
  };
}

export interface UserProfile extends UserResponse {
  meals?: Meal[];
  exercises?: Exercise[];
  meditations?: Meditation[];
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum Goal {
  WEIGHT_LOSS = "WEIGHT_LOSS",
  MUSCLE_GAIN = "MUSCLE_GAIN",
  MAINTENANCE = "MAINTENANCE"
}

// Para importar nos services
import { Meal } from "./meal.types";
import { Exercise } from "./exercise.types";
import { Meditation } from "./meditation.types";