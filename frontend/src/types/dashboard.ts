export interface DashboardSummary {

  date: string;

  imc: number | null;

  weight: number | null;

  goal: string | null;

  calories: {
    consumed: number;
    burned: number;
    balance: number;
    weeklyAverageConsumed: number;
    weeklyAverageBurned: number;
  };

  exercises: {
    total: number;
    totalDuration: number;
    totalCalories: number;
  };

  meals: {
    total: number;
    totalCalories: number;
  };

  meditation: {
    total: number;
    avgMood: number;
    totalMinutes: number;
  };

  streak: {
    current: number;
    longest: number;
  };
  total: {
    meals: number;
    caloriesIn: number;
    exercises: number;
    caloriesOut: number;
    meditations: number;
    meditationMinutes: number;
    averageMood: number;
  };
}

export interface WeeklyProgress {

  day: string;

  caloriesIn: number;

  caloriesOut: number;

  mealsCount: number;

  exercisesCount: number;
}

export interface MonthlyReport {

  year: number;

  month: number;

  summary: {

    totalMeals: number;

    totalExercises: number;

    totalMeditations: number;

    totalCaloriesIn: number;

    totalCaloriesOut: number;

    netCalories: number;

    totalExerciseMinutes: number;

    totalMeditationMinutes: number;

    averageMood: number;
  };

  dailyData: {
    date: string;
    caloriesIn: number;
    caloriesOut: number;
    averageMood: number;
  }[];
}