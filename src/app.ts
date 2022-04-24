import { Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";
import { dbConfig } from "./utils/connect";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middleware/error-handler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  (res as any).send("meow");
});

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;

const start = async () => {
  try {
    await dbConfig.authenticate();
    await dbConfig.sync();
    logger.info("DB connected");
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

start();
