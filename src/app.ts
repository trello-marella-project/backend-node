import { Request, Response } from "express";
import express from "express";
import { dbConfig } from "./utils/connect";
import dotenv from "dotenv";
import logger from "./utils/logger";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";

dotenv.config();

require("express-async-errors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  (res as any).send("meow");
});

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
