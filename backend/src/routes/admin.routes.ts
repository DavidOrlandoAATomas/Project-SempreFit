import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const router = Router();

router.get(
  "/users",
  authMiddleware,
  authorize("ADMIN"),
  async (req, res) => {

    const users =
      await prisma.user.findMany();

    res.json(users);
  }
);

export default router;