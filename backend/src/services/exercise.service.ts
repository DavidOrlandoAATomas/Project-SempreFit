// services/exercise.service.ts
import prisma from "../config/prisma";
import { AppError } from "../utils/errors";
import { Exercise } from "@prisma/client";

export class ExerciseService {
  
  async create(data: { activity: string; duration: number; caloriesBurned: number }, userId: string): Promise<Exercise> {
    const exercise = await prisma.exercise.create({
      data: {
        activity: data.activity,
        duration: data.duration,
        caloriesBurned: data.caloriesBurned,
        userId: userId
      }
    });

    return exercise;
  }

  async findAll(userId: string): Promise<Exercise[]> {
    return prisma.exercise.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string, userId: string): Promise<Exercise> {
    const exercise = await prisma.exercise.findFirst({
      where: { id, userId }
    });

    if (!exercise) {
      throw new AppError("Exercise not found", 404);
    }

    return exercise;
  }

  async update(id: string, data: Partial<Omit<Exercise, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>, userId: string): Promise<Exercise> {
    const exercise = await prisma.exercise.findFirst({
      where: { id, userId }
    });

    if (!exercise) {
      throw new AppError("Exercise not found or unauthorized", 404);
    }

    return prisma.exercise.update({
      where: { id },
      data
    });
  }

  async delete(id: string, userId: string): Promise<Exercise> {
    const exercise = await prisma.exercise.findFirst({
      where: { id, userId }
    });

    if (!exercise) {
      throw new AppError("Exercise not found or unauthorized", 404);
    }

    return prisma.exercise.delete({
      where: { id }
    });
  }

  async getStats(userId: string) {
    const exercises = await this.findAll(userId);
    
    const totalCalories = exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);
    const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
    
    const activityCount = new Map<string, number>();
    exercises.forEach(ex => {
      activityCount.set(ex.activity, (activityCount.get(ex.activity) || 0) + 1);
    });
    
    let mostFrequentActivity = "";
    let maxCount = 0;
    for (const [activity, count] of activityCount) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentActivity = activity;
      }
    }

    return {
      totalExercises: exercises.length,
      totalCalories,
      totalDuration,
      averageCalories: exercises.length > 0 ? totalCalories / exercises.length : 0,
      averageDuration: exercises.length > 0 ? totalDuration / exercises.length : 0,
      mostFrequentActivity
    };
  }
}