import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {

  res.status(200).json({

    status: "UP",

    service: "SempreFit API",

    timestamp: new Date()
  });
});

export default router;