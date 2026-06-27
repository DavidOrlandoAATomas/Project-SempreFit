import express from "express";
import cors from "cors";
import helmet from "helmet";
import {swaggerSpec} from "./config/swagger"
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api", routes);

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(errorMiddleware);

export default app;