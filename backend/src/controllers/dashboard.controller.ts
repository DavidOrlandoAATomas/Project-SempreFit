// controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  /**
   * @swagger
   * /api/dashboard/summary:
   *   get:
   *     summary: Get dashboard summary
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard summary data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     date:
   *                       type: string
   *                     imc:
   *                       type: number
   *                     weight:
   *                       type: number
   *                     goal:
   *                       type: string
   *                     calories:
   *                       type: object
   *                     exercises:
   *                       type: object
   *                     meals:
   *                       type: object
   *                     meditation:
   *                       type: object
   *                     streak:
   *                       type: object
   *       401:
   *         description: Unauthorized
   */
  async getSummary(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const summary = await dashboardService.getSummary(userId);
      res.json({
        success: true,
        data: summary
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
   * /dashboard/weekly-progress:
   *   get:
   *     summary: Get weekly progress
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Weekly progress data
   *       401:
   *         description: Unauthorized
   */
  async getWeeklyProgress(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const progress = await dashboardService.getWeeklyProgress(userId);
      res.json({
        success: true,
        data: progress
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
   * /dashboard/monthly-report:
   *   get:
   *     summary: Get monthly report
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: year
   *         required: true
   *         schema:
   *           type: integer
   *         description: Year (e.g., 2024)
   *       - in: query
   *         name: month
   *         required: true
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 12
   *         description: Month (1-12)
   *     responses:
   *       200:
   *         description: Monthly report data
   *       400:
   *         description: Invalid year or month
   *       401:
   *         description: Unauthorized
   */
  async getMonthlyReport(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      const year = parseInt(req.query.year as string);
      const month = parseInt(req.query.month as string);
      
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        throw new Error('Invalid year or month');
      }
      
      const report = await dashboardService.getMonthlyReport(userId, year, month);
      res.json({
        success: true,
        data: report
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}