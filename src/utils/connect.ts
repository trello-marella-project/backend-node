import { Sequelize } from "sequelize";

import { UserFactory } from "../models/user.model";
import { TokenFactory } from "../models/token.model";
import { LinkFactory } from "../models/link.model";
import { SpaceFactory } from "../models/space.model";
import { TagFactory } from "../models/tag.model";

import dotenv from "dotenv";
import { PermissionFactory } from "../models/permission.model";
import { EntranceFactory } from "../models/entrance.model";
import { CardFactory } from "../models/card.model";
import { BlockFactory } from "../models/block.model";
import { ReportFactory } from "../models/report.model";

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
const Space = SpaceFactory(dbConfig);
const Tag = TagFactory(dbConfig);
const Permission = PermissionFactory(dbConfig);
const Entrance = EntranceFactory(dbConfig);
const Block = BlockFactory(dbConfig);
const Card = CardFactory(dbConfig);
const Report = ReportFactory(dbConfig);

Space.hasMany(Tag, { foreignKey: "space_id" });
Tag.belongsTo(Space, { foreignKey: "space_id" });

Space.hasMany(Permission, { foreignKey: "space_id" });
Permission.belongsTo(Space, { foreignKey: "space_id" });

Space.hasMany(Block, { foreignKey: "space_id" });
Block.belongsTo(Space, { foreignKey: "space_id" });

Block.hasMany(Card, { foreignKey: "block_id" });
Card.belongsTo(Block, { foreignKey: "block_id" });

User.hasMany(Report, { foreignKey: "user_id" });
Report.belongsTo(User, { foreignKey: "declarer_user_id" });

User.hasMany(Report, { foreignKey: "user_id" });
Report.belongsTo(User, { foreignKey: "accused_user_id" });

export {
  dbConfig,
  User,
  Token,
  ActivationLink,
  Space,
  Tag,
  Permission,
  Entrance,
  Block,
  Card,
  Report,
};
