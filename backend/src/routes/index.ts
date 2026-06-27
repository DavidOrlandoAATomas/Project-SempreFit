import { Router } from "express";

import authRoutes from "./auth.routes";
import mealRoutes from "./meal.routes";
import exerciseRoutes from "./exercise.routes";
import meditationRoutes from "./meditation.routes";
import healthRoutes from "./health.routes";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import dashboardRoutes from "./dashboard.routes";
import recipesRoutes from './recipes.routes';
import integrationsRoutes from './integrations.routes';

const router = Router();

router.use("/auth", authRoutes);
router.use("/meals", mealRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/meditations", meditationRoutes);
router.use("/health",healthRoutes);
router.use("/admin",adminRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use('/recipes', recipesRoutes);
router.use('/integrations', integrationsRoutes);

export default router;