// services/dashboard.service.ts
import prisma from "../config/prisma";
import { AppError } from "../utils/errors";

export class DashboardService {
  
  async getSummary(userId: string) {
    // Buscar usuário com dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        height: true,
        weight: true,
        goal: true
      }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Buscar dados de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Buscar dados em paralelo para melhor performance
    const [meals, exercises, meditations, last7DaysMeals, last7DaysExercises, totalMeals, totalExercises, totalMeditations] = await Promise.all([
      // Dados de hoje
      prisma.meal.findMany({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.exercise.findMany({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.meditation.findMany({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      // Dados dos últimos 7 dias para tendências
      prisma.meal.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.exercise.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Dados TOTAIS
      prisma.meal.findMany({
        where: { userId }
      }),
      prisma.exercise.findMany({
        where: { userId }
      }),
      prisma.meditation.findMany({
        where: { userId }
      })
    ]);

    // Calcular calorias do dia
    const caloriesIn = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const caloriesOut = exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
    
    // Calcular IMC
    let imc = null;
    if (user.height && user.weight && user.height > 0) {
      const heightInMeters = user.height / 100;
      imc = Number((user.weight / (heightInMeters * heightInMeters)).toFixed(2));
    }
    
    // Calcular médias dos últimos 7 dias
    const avgCaloriesIn = last7DaysMeals.length > 0
      ? last7DaysMeals.reduce((sum, m) => sum + m.calories, 0) / 7
      : 0;
      
    const avgCaloriesOut = last7DaysExercises.length > 0
      ? last7DaysExercises.reduce((sum, e) => sum + e.caloriesBurned, 0) / 7
      : 0;
    
    // Estatísticas de meditação (hoje)
    const meditationStats = {
      total: meditations.length,
      avgMood: meditations.length > 0
        ? Number((meditations.reduce((sum, m) => sum + m.mood, 0) / meditations.length).toFixed(1))
        : 0,
      totalMinutes: meditations.reduce((sum, m) => sum + m.duration, 0)
    };
    
    // Estatísticas TOTAIS
    const totalStats = {
      totalMeals: totalMeals.length,
      totalCaloriesIn: totalMeals.reduce((sum, m) => sum + m.calories, 0),
      totalExercises: totalExercises.length,
      totalCaloriesOut: totalExercises.reduce((sum, e) => sum + e.caloriesBurned, 0),
      totalMeditations: totalMeditations.length,
      totalMeditationMinutes: totalMeditations.reduce((sum, m) => sum + m.duration, 0),
      averageMood: totalMeditations.length > 0
        ? Number((totalMeditations.reduce((sum, m) => sum + m.mood, 0) / totalMeditations.length).toFixed(1))
        : 0
    };
    
    // Calcular streak (dias consecutivos com atividade)
    const streak = await this.calculateStreak(userId);
    
    return {
      // Dados de hoje
      date: today.toISOString().split('T')[0],
      imc,
      weight: user.weight,
      goal: user.goal,
      calories: {
        consumed: caloriesIn,
        burned: caloriesOut,
        balance: caloriesOut - caloriesIn,
        weeklyAverageConsumed: Math.round(avgCaloriesIn),
        weeklyAverageBurned: Math.round(avgCaloriesOut)
      },
      exercises: {
        total: exercises.length,
        totalDuration: exercises.reduce((sum, e) => sum + e.duration, 0),
        totalCalories: caloriesOut
      },
      meals: {
        total: meals.length,
        totalCalories: caloriesIn
      },
      meditation: meditationStats,
      streak: {
        current: streak.current,
        longest: streak.longest
      },
      // Dados TOTAIS
      total: {
        meals: totalStats.totalMeals,
        caloriesIn: totalStats.totalCaloriesIn,
        exercises: totalStats.totalExercises,
        caloriesOut: totalStats.totalCaloriesOut,
        meditations: totalStats.totalMeditations,
        meditationMinutes: totalStats.totalMeditationMinutes,
        averageMood: totalStats.averageMood
      }
    };
  }

  async getWeeklyProgress(userId: string) {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    
    const [meals, exercises] = await Promise.all([
      prisma.meal.findMany({
        where: {
          userId,
          createdAt: {
            gte: startOfWeek,
            lt: endOfWeek
          }
        }
      }),
      prisma.exercise.findMany({
        where: {
          userId,
          createdAt: {
            gte: startOfWeek,
            lt: endOfWeek
          }
        }
      })
    ]);
    
    // Agrupar por dia da semana
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const progress = weekDays.map((day, index) => {
      const dayMeals = meals.filter(m => m.createdAt.getDay() === index);
      const dayExercises = exercises.filter(e => e.createdAt.getDay() === index);
      
      return {
        day,
        caloriesIn: dayMeals.reduce((sum, m) => sum + m.calories, 0),
        caloriesOut: dayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0),
        mealsCount: dayMeals.length,
        exercisesCount: dayExercises.length
      };
    });
    
    return progress;
  }

  async getMonthlyReport(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const [meals, exercises, meditations] = await Promise.all([
      prisma.meal.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      prisma.exercise.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      prisma.meditation.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      })
    ]);
    
    const totalCaloriesIn = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalCaloriesOut = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
    
    return {
      year,
      month,
      summary: {
        totalMeals: meals.length,
        totalExercises: exercises.length,
        totalMeditations: meditations.length,
        totalCaloriesIn,
        totalCaloriesOut,
        netCalories: totalCaloriesOut - totalCaloriesIn,
        totalExerciseMinutes: exercises.reduce((sum, e) => sum + e.duration, 0),
        totalMeditationMinutes: meditations.reduce((sum, m) => sum + m.duration, 0),
        averageMood: meditations.length > 0
          ? Number((meditations.reduce((sum, m) => sum + m.mood, 0) / meditations.length).toFixed(1))
          : 0
      },
      dailyData: this.groupByDay([...meals, ...exercises, ...meditations])
    };
  }

  private async calculateStreak(userId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activities = await prisma.$queryRaw`
        SELECT DATE("createdAt") as date, COUNT(*) as count
        FROM (
          SELECT "createdAt" FROM "Meal" WHERE "userId" = ${userId}
          UNION ALL
          SELECT "createdAt" FROM "Exercise" WHERE "userId" = ${userId}
          UNION ALL
          SELECT "createdAt" FROM "Meditation" WHERE "userId" = ${userId}
        ) as activities
        WHERE "createdAt" >= ${thirtyDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      `;
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate: Date | null = null;
      
      for (const activity of activities as any[]) {
        const activityDate = new Date(activity.date);
        
        if (lastDate === null) {
          tempStreak = 1;
        } else {
          const dayDiff = Math.floor((lastDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak);
        
        if (activityDate.toDateString() === today.toDateString()) {
          currentStreak = tempStreak;
        }
        
        lastDate = activityDate;
      }
      
      return { current: currentStreak, longest: longestStreak };
    } catch (error) {
      console.error("Error calculating streak:", error);
      return { current: 0, longest: 0 };
    }
  }

  private groupByDay(items: any[]) {
    const grouped = new Map();
    
    items.forEach(item => {
      const date = item.createdAt.toISOString().split('T')[0];
      if (!grouped.has(date)) {
        grouped.set(date, {
          date,
          caloriesIn: 0,
          caloriesOut: 0,
          meditationMood: 0,
          meditationCount: 0
        });
      }
      
      const dayData = grouped.get(date);
      if (item.calories) {
        dayData.caloriesIn += item.calories;
      }
      if (item.caloriesBurned) {
        dayData.caloriesOut += item.caloriesBurned;
      }
      if (item.mood) {
        dayData.meditationMood += item.mood;
        dayData.meditationCount++;
      }
    });
    
    return Array.from(grouped.values()).map(data => ({
      ...data,
      averageMood: data.meditationCount > 0 ? Number((data.meditationMood / data.meditationCount).toFixed(1)) : 0
    }));
  }
}