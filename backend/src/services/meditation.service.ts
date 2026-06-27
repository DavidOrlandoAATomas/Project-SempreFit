// services/meditation.service.ts
import prisma from "../config/prisma";
import { AppError } from "../utils/errors";
import { Meditation } from "@prisma/client";

export class MeditationService {
  
  async create(data: { mood: number; duration: number; notes?: string }, userId: string): Promise<Meditation> {
    // Validações
    if (!data.mood || data.mood < 1 || data.mood > 10) {
      throw new AppError("Mood must be between 1 and 10", 400);
    }
    
    if (!data.duration || data.duration <= 0) {
      throw new AppError("Duration must be greater than 0", 400);
    }
    
    if (data.duration > 480) {
      throw new AppError("Duration cannot exceed 480 minutes (8 hours)", 400);
    }

    const meditation = await prisma.meditation.create({
      data: {
        mood: data.mood,
        duration: data.duration,
        notes: data.notes,
        userId: userId
      }
    });

    return meditation;
  }

  async findAll(userId: string): Promise<Meditation[]> {
    return prisma.meditation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string, userId: string): Promise<Meditation> {
    const meditation = await prisma.meditation.findFirst({
      where: { id, userId }
    });

    if (!meditation) {
      throw new AppError("Meditation session not found", 404);
    }

    return meditation;
  }

  async update(id: string, data: Partial<Omit<Meditation, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>, userId: string): Promise<Meditation> {
    // Verificar ownership
    const meditation = await prisma.meditation.findFirst({
      where: { id, userId }
    });

    if (!meditation) {
      throw new AppError("Meditation session not found or unauthorized", 404);
    }

    // Validações se os campos forem fornecidos
    if (data.mood !== undefined && (data.mood < 1 || data.mood > 10)) {
      throw new AppError("Mood must be between 1 and 10", 400);
    }
    
    if (data.duration !== undefined && data.duration <= 0) {
      throw new AppError("Duration must be greater than 0", 400);
    }

    const updatedMeditation = await prisma.meditation.update({
      where: { id },
      data: {
        mood: data.mood,
        duration: data.duration,
        notes: data.notes
      }
    });

    return updatedMeditation;
  }

  async delete(id: string, userId: string): Promise<Meditation> {
    const meditation = await prisma.meditation.findFirst({
      where: { id, userId }
    });

    if (!meditation) {
      throw new AppError("Meditation session not found or unauthorized", 404);
    }

    return prisma.meditation.delete({
      where: { id }
    });
  }

  async getStats(userId: string) {
    const meditations = await this.findAll(userId);
    
    if (meditations.length === 0) {
      return {
        totalMeditations: 0,
        totalDuration: 0,
        averageDuration: 0,
        averageMood: 0,
        bestMood: 0,
        worstMood: 0,
        totalNotes: 0
      };
    }
    
    const totalDuration = meditations.reduce((sum, m) => sum + m.duration, 0);
    const averageMood = meditations.reduce((sum, m) => sum + m.mood, 0) / meditations.length;
    const bestMood = Math.max(...meditations.map(m => m.mood));
    const worstMood = Math.min(...meditations.map(m => m.mood));
    const totalNotes = meditations.filter(m => m.notes).length;
    
    return {
      totalMeditations: meditations.length,
      totalDuration,
      averageDuration: Math.round(totalDuration / meditations.length),
      averageMood: Number(averageMood.toFixed(1)),
      bestMood,
      worstMood,
      totalNotes
    };
  }

  async getWeeklyMoodTrend(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const meditations = await prisma.meditation.findMany({
      where: {
        userId,
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    
    // Agrupar por dia
    const dailyMood = new Map();
    meditations.forEach(m => {
      const date = m.createdAt.toISOString().split('T')[0];
      if (!dailyMood.has(date)) {
        dailyMood.set(date, { totalMood: 0, count: 0 });
      }
      const day = dailyMood.get(date);
      day.totalMood += m.mood;
      day.count++;
    });
    
    const trend = Array.from(dailyMood.entries()).map(([date, data]) => ({
      date,
      averageMood: Number((data.totalMood / data.count).toFixed(1)),
      sessions: data.count
    }));
    
    return trend;
  }
}