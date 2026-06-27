// services/user.service.ts
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { CreateUserDTO, UpdateUserDTO, UserResponse, Gender, Goal } from "../types/user.types";
import { AppError } from "../utils/errors";
import { EmailService } from "./email.service";

const emailService = new EmailService();


export const UserService = {
  async register(data: CreateUserDTO): Promise<UserResponse> {
    // Validar email
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new AppError("Email inválido, por favor, verifique o formato", 400);
    }

    // Verificar se usuário existe
    const userExists = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (userExists) {
      throw new AppError("Usuário já existe", 409);
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar usuário com valores padrão para campos obrigatórios
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        height: data.height || 0,
        weight: data.weight || 0,
        birthDate: data.birthDate || new Date(),
        gender: (data.gender || "MALE") as Gender,
        goal: (data.goal || "MAINTENANCE") as Goal
      }
    });

      emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);


    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponse;
  },

  async updateProfile(userId: string, data: UpdateUserDTO): Promise<UserResponse> {
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      throw new AppError("User not found", 404);
    }

    if (data.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      });
      
      if (emailExists && emailExists.id !== userId) {
        throw new AppError("Email already in use", 409);
      }
    }

    let updateData: any = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as UserResponse;
  },

  async getUserProfile(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            meals: true,
            exercises: true,
            meditations: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponse;
  },

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        height: true,
        weight: true,
        birthDate: true,
        gender: true,
        goal: true,
        createdAt: true,
        _count: {
          select: {
            meals: true,
            exercises: true,
            meditations: true
          }
        }
      }
    });

    return users as UserResponse[];
  },

  async deleteUser(userId: string): Promise<void> {
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      throw new AppError("User not found", 404);
    }

    await prisma.user.delete({
      where: { id: userId }
    });
  },
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verificar senha atual
    const isValid = await comparePassword(oldPassword, user.password);
    if (!isValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Validar nova senha
    if (newPassword.length < 6) {
      throw new AppError("New password must be at least 6 characters", 400);
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(newPassword);
    
    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  },

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};