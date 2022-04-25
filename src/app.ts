import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import cookieParser from "cookie-parser";

import logger from "./utils/logger";
import authRoutes from "./routes/auth.route";
import { dbConfig } from "./utils/connect";

import { errorHandlerMiddleware } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.use(notFound);
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
