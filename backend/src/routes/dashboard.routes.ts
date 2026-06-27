// routes/dashboard.routes.ts
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics endpoints
 */

router.use(authMiddleware);

router.get(
  '/summary',
  dashboardController.getSummary.bind(dashboardController)
);

router.get(
  '/weekly-progress',
  dashboardController.getWeeklyProgress.bind(dashboardController)
);

router.get(
  '/monthly-report',
  dashboardController.getMonthlyReport.bind(dashboardController)
);

export default router;