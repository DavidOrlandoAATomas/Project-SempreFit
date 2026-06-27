export type MealCategory =
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SNACK"
  | "DESSERT"
  | "BEVERAGE";

export interface Meal {

  id: string;

  name: string;

  calories: number;

  category: string;

  createdAt: string;
}

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