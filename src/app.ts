import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import { dbConfig } from "./utils/connect";
import dotenv from "dotenv";

dotenv.config();

// routes import
import authRoutes from "./routes/auth.route";
import usersRoutes from "./routes/users.route";
import userRoutes from "./routes/user.route";

// middleware import
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import { deserializeUser } from "./middleware/deserialize-user";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(deserializeUser);

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/user", userRoutes);

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
