import { Sequelize } from "sequelize";

import { UserFactory } from "../models/user.module";
import { TokenFactory } from "../models/token.module";
import { LinkFactory } from "../models/link.module";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    port: Number(process.env.DB_PORT) || 5001,
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  }
);

const User = UserFactory(dbConfig);
const Token = TokenFactory(dbConfig);
const ActivationLink = LinkFactory(dbConfig);

// User.hasOne(User);

// User.hasMay(Skills);
//
// or instead of that, maybe many users have many skills
// Skills.belongsToMany(Users, { through: "users_have_skills" });

export { dbConfig, User, Token, ActivationLink };
