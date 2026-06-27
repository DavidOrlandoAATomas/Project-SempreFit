import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import {UserRoleService} from "../services/user.role.service";
import { Prisma } from '@prisma/client';
import prisma from "../config/prisma";

const userService = UserService;
const userRoleService = new UserRoleService();

export class UserController {
  /**
   * @swagger
   * /api/users/profile:
   *   get:
   *     summary: Get user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const profile = await userService.getUserProfile(userId);
      res.json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      const status = error.message === 'User not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/users/profile:
   *   put:
   *     summary: Update user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               height:
   *                 type: number
   *               weight:
   *                 type: number
   *               birthDate:
   *                 type: string
   *                 format: date-time
   *               gender:
   *                 type: string
   *                 enum: [MALE, FEMALE]
   *               goal:
   *                 type: string
   *                 enum: [WEIGHT_LOSS, MUSCLE_GAIN, MAINTENANCE]
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const updatedUser = await userService.updateProfile(userId, req.body);
      res.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully'
      });
    } catch (error: any) {
      const status = error.message === 'User not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/users/change-password:
   *   post:
   *     summary: Change user password
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - oldPassword
   *               - newPassword
   *             properties:
   *               oldPassword:
   *                 type: string
   *                 format: password
   *               newPassword:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: Password changed successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Invalid current password
   *       404:
   *         description: User not found
   */
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const { oldPassword, newPassword } = req.body;
      await userService.changePassword(userId, oldPassword, newPassword);
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      const status = error.message === 'User not found' ? 404 :
                     error.message === 'Current password is incorrect' ? 401 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all users
   *       403:
   *         description: Admin access required
   *       401:
   *         description: Unauthorized
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({
        success: true,
        data: users
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete user (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       403:
   *         description: Admin access required
   *       404:
   *         description: User not found
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await userService.deleteUser(id);
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
  async promote(req: Request, res: Response) {
  try {
    const user = await userRoleService.promoteToAdmin(req.params.id as string);

    res.json({
      success: true,
      data: user,
      message: "User promoted to ADMIN"
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async demote(req: Request, res: Response) {
  try {
    const user = await userRoleService.demoteToUser(req.params.id as string);

    res.json({
      success: true,
      data: user,
      message: "User demoted to USER"
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
async getAdminStats(req: Request, res: Response) {
  try {    
    const users = await prisma.user.count();
    const admins = await prisma.user.count({
      where: { role: "ADMIN" }
    });

    const meals = await prisma.meal.count();
    const exercises = await prisma.exercise.count();
    const meditations = await prisma.meditation.count();

    const avgCalories = await prisma.meal.aggregate({
      _avg: { calories: true }
    });

    const avgCaloriesBurned = await prisma.exercise.aggregate({
      _avg: { caloriesBurned: true }
    });

    const avgMood = await prisma.meditation.aggregate({
      _avg: { mood: true }
    });

    res.json({
      success: true,
      data: {
        users,
        admins,
        meals,
        exercises,
        meditations,
        avgCalories: Math.round(avgCalories._avg.calories || 0),
        avgCaloriesBurned: Math.round(avgCaloriesBurned._avg.caloriesBurned || 0),
        avgMood: Number((avgMood._avg.mood || 0).toFixed(1))
      }
    });
  } catch (error: any) {
    console.error("Error in getAdminStats:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}
}