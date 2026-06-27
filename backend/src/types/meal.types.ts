// types/meal.types.ts
export interface CreateMealDTO {
  name: string;
  calories: number;
  category: string;
}

export interface UpdateMealDTO {
  name?: string;
  calories?: number;
  category?: string;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  category: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealWithUser extends Meal {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface MealSummary {
  totalCalories: number;
  mealsCount: number;
  averageCalories: number;
  mealsByCategory: Record<string, number>;
}

export interface DailyMealSummary {
  date: string;
  totalCalories: number;
  meals: Meal[];
}

export interface MealFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  minCalories?: number;
  maxCalories?: number;
}

export enum MealCategory {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
  DESSERT = "DESSERT",
  BEVERAGE = "BEVERAGE"
}