// services/meal.service.ts
import prisma from "../config/prisma";
import { AppError } from "../utils/errors";
import { Meal } from "@prisma/client";

export class MealService {
  async create(data: { name: string; calories: number; category: string }, userId: string): Promise<Meal> {
    return prisma.meal.create({
      data: { ...data, userId }
    });
  }

  async findAll(userId: string): Promise<Meal[]> {
    return prisma.meal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string, userId: string): Promise<Meal> {
    const meal = await prisma.meal.findFirst({
      where: { id, userId }
    });

    if (!meal) {
      throw new AppError("Meal not found", 404);
    }

    return meal;
  }

  async update(id: string, data: Partial<Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>, userId: string): Promise<Meal> {
    
    const meal = await prisma.meal.findFirst({
      where: { id, userId }
    });

    if (!meal) {
      throw new AppError("Meal not found or unauthorized", 404);
    }

    return prisma.meal.update({
      where: { id },
      data
    });
  }

  async delete(id: string, userId: string): Promise<Meal> {
    const meal = await prisma.meal.findFirst({
      where: { id, userId }
    });

    if (!meal) {
      throw new AppError("Meal not found or unauthorized", 404);
    }

    return prisma.meal.delete({
      where: { id }
    });
  }
}