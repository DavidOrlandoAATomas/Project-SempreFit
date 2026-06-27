// services/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { AppError } from "../utils/errors";
import { LoginDTO, AuthResponse, JwtPayload } from "../types/auth.types";
import { EmailService } from "./email.service";

const emailService = new EmailService();


export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRY = "15m";
  private readonly REFRESH_TOKEN_EXPIRY = "7d";

  async login(email: string, password: string): Promise<AuthResponse> {
    // Validar entrada
    if (!email || !password) {
      throw new AppError("Email e senha são obrigatórios", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        name: true,
      }
    });

    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Credenciais inválidas", 401);
    }

    // Gerar tokens
    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // Salvar refresh token no banco
    await this.saveRefreshToken(user.id, refreshToken);

      emailService.sendLoginNotification(user.email, user.name).catch(console.error);


    const { password: _, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const storedToken = await prisma.refreshToken.findFirst({
        where: { token: refreshToken }
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError("Invalid or expired refresh token", 401);
      }

      // Verificar JWT
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as JwtPayload;

      if (!decoded || !decoded.userId) {
        throw new AppError("Invalid token payload", 401);
      }

      // Gerar novo access token
      const accessToken = this.generateAccessToken(decoded.userId, decoded.role || "USER");

      return { accessToken };
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    // Remover refresh token específico ou todos do usuário
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken
      }
    });
  }

  async logoutAll(userId: string): Promise<void> {
    // Remover todos refresh tokens do usuário
    await prisma.refreshToken.deleteMany({
      where: { userId }
    });
  }

  private generateAccessToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET!,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }
}