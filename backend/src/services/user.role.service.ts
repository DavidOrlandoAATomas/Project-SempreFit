import prisma from "../config/prisma";
import { AppError } from "../utils/errors";

export class UserRoleService {
  async promoteToAdmin(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      throw new AppError("User is already an ADMIN", 400);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }

  async demoteToUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "USER") {
      throw new AppError("User is already a USER", 400);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }
}