// controllers/exercise.controller.ts
import { Request, Response } from 'express';
import { ExerciseService } from '../services/exercise.service';

const exerciseService = new ExerciseService();

export class ExerciseController {
  /**
   * @swagger
   * /api/exercises:
   *   post:
   *     summary: Create a new exercise
   *     tags: [Exercises]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - activity
   *               - duration
   *               - caloriesBurned
   *             properties:
   *               activity:
   *                 type: string
   *                 example: Running
   *               duration:
   *                 type: integer
   *                 example: 30
   *               caloriesBurned:
   *                 type: integer
   *                 example: 300
   *     responses:
   *       201:
   *         description: Exercise created successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  async create(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const exercise = await exerciseService.create(req.body, userId);
      res.status(201).json({
        success: true,
        data: exercise,
        message: 'Exercise created successfully'
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
   * /api/exercises:
   *   get:
   *     summary: Get all user exercises
   *     tags: [Exercises]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of exercises
   *       401:
   *         description: Unauthorized
   */
  async findAll(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const exercises = await exerciseService.findAll(userId);
      res.json({
        success: true,
        data: exercises
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
   * /api/exercises/stats:
   *   get:
   *     summary: Get exercise statistics
   *     tags: [Exercises]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Exercise statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalExercises:
   *                   type: integer
   *                 totalCalories:
   *                   type: integer
   *                 totalDuration:
   *                   type: integer
   *                 averageCalories:
   *                   type: number
   *                 averageDuration:
   *                   type: number
   *                 mostFrequentActivity:
   *                   type: string
   */
  async getStats(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const stats = await exerciseService.getStats(userId);
      res.json({
        success: true,
        data: stats
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
   * /api/exercises/{id}:
   *   put:
   *     summary: Update exercise
   *     tags: [Exercises]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               activity:
   *                 type: string
   *               duration:
   *                 type: integer
   *               caloriesBurned:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Exercise updated successfully
   *       404:
   *         description: Exercise not found
   */
  async update(req: Request, res: Response) {
    try {
      const id  = req.params.id as string;
      const userId = req.user.userId;
      const exercise = await exerciseService.update(id, req.body, userId);
      res.json({
        success: true,
        data: exercise,
        message: 'Exercise updated successfully'
      });
    } catch (error: any) {
      console.error("UPDATE ERROR:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/exercises/{id}:
   *   delete:
   *     summary: Delete exercise
   *     tags: [Exercises]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Exercise deleted successfully
   *       404:
   *         description: Exercise not found
   */
  async delete(req: Request, res: Response) {
    try {
      const id  = req.params.id as string;
      const userId = req.user.userId;
      
      console.log("DELETE - ID:", id);
      console.log("DELETE - UserId:", userId);

      await exerciseService.delete(id, userId);
      res.json({
        success: true,
        message: 'Exercise deleted successfully'
      });
    } catch (error: any) {
      console.error("DELETE ERROR:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}