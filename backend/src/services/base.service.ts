// services/base.service.ts
import prisma from "../config/prisma";
import { AppError } from "../utils/errors";

// Interface base que todos os modelos devem ter
interface BaseModel {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseService<T extends BaseModel> {
  protected model: any;
  protected modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
    this.model = prisma[modelName as keyof typeof prisma];
  }

  async findById(id: string, include?: any): Promise<T> {
    const item = await this.model.findUnique({
      where: { id },
      include
    });

    if (!item) {
      throw new AppError(`${this.modelName} not found`, 404);
    }

    return item as T;
  }

  async findAll(userId: string, options?: any): Promise<T[]> {
    const items = await this.model.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      ...options
    });

    return items as T[];
  }

  async create(data: any, userId: string): Promise<T> {
    const item = await this.model.create({
      data: { ...data, userId }
    });

    return item as T;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>, userId: string): Promise<T> {
    // Verificar ownership
    await this.verifyOwnership(id, userId);

    const updatedItem = await this.model.update({
      where: { id },
      data
    });

    return updatedItem as T;
  }

  async delete(id: string, userId: string): Promise<T> {
    // Verificar ownership
    await this.verifyOwnership(id, userId);

    const deletedItem = await this.model.delete({
      where: { id }
    });

    return deletedItem as T;
  }

  // Método auxiliar para verificar ownership
  protected async verifyOwnership(id: string, userId: string): Promise<void> {
    const item = await this.model.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!item) {
      throw new AppError(`${this.modelName} not found`, 404);
    }

    if (item.userId !== userId) {
      throw new AppError("Unauthorized: You don't own this resource", 403);
    }
  }
}