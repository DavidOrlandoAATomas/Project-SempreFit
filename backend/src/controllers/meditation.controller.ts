// controllers/meditation.controller.ts
import { Request, Response } from 'express';
import { MeditationService } from '../services/meditation.service';

const meditationService = new MeditationService();

export class MeditationController {
  /**
   * @swagger
   * /api/meditations:
   *   post:
   *     summary: Create a new meditation session
   *     tags: [Meditations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - mood
   *               - duration
   *             properties:
   *               mood:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 10
   *                 example: 8
   *               duration:
   *                 type: integer
   *                 example: 15
   *               notes:
   *                 type: string
   *                 example: Felt very relaxed
   *     responses:
   *       201:
   *         description: Meditation session created successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   */
  async create(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const meditation = await meditationService.create(req.body, userId);
      res.status(201).json({
        success: true,
        data: meditation,
        message: 'Meditation session created successfully'
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
   * /api/meditations:
   *   get:
   *     summary: Get all user meditation sessions
   *     tags: [Meditations]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of meditation sessions
   *       401:
   *         description: Unauthorized
   */
  async findAll(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const meditations = await meditationService.findAll(userId);
      res.json({
        success: true,
        data: meditations
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
   * /api/meditations/stats:
   *   get:
   *     summary: Get meditation statistics
   *     tags: [Meditations]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Meditation statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalMeditations:
   *                   type: integer
   *                 totalDuration:
   *                   type: integer
   *                 averageDuration:
   *                   type: number
   *                 averageMood:
   *                   type: number
   *                 bestMood:
   *                   type: integer
   *                 worstMood:
   *                   type: integer
   *                 totalNotes:
   *                   type: integer
   */
  async getStats(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const stats = await meditationService.getStats(userId);
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
   * /api/meditations/weekly-trend:
   *   get:
   *     summary: Get weekly mood trend
   *     tags: [Meditations]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Weekly mood trend data
   */
  async getWeeklyTrend(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const trend = await meditationService.getWeeklyMoodTrend(userId);
      res.json({
        success: true,
        data: trend
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
   * /api/meditations/{id}:
   *   put:
   *     summary: Update meditation session
   *     tags: [Meditations]
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
   *               mood:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 10
   *               duration:
   *                 type: integer
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Meditation session updated successfully
   *       404:
   *         description: Meditation session not found
   */
  async update(req: Request, res: Response) {
  console.log("================================");
  console.log("UPDATE FOI CHAMADO");
  console.log("PARAMS:", req.params);
  console.log("BODY:", req.body);
  console.log("================================");
    try {
  console.log("PARAMS:", req.params);
  console.log("BODY:", req.body);
  
      const id = req.params.id as string;
      const userId = req.user.userId;
      const meditation = await meditationService.update(id, req.body, userId);
      res.json({
        success: true,
        data: meditation,
        message: 'Meditation session updated successfully'
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
   * /api/meditations/{id}:
   *   delete:
   *     summary: Delete meditation session
   *     tags: [Meditations]
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
   *         description: Meditation session deleted successfully
   *       404:
   *         description: Meditation session not found
   */
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = req.user.userId;

      console.log("DELETE-ID:", id);
      console.log("DELETE-USERID:", userId);

      await meditationService.delete(id, userId);
      res.json({
        success: true,
        message: 'Meditation session deleted successfully'
      });
    } catch (error: any) {
      console.error("DELETE ERRORR", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}