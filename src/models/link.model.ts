import { DataTypes, Sequelize, Model, BuildOptions } from "sequelize";

export interface LinkAttributes {
  user_id: number;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LinkModel extends Model<LinkAttributes>, LinkAttributes {}

export type LinkStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): LinkModel;
};

export function LinkFactory(sequelize: Sequelize): LinkStatic {
  return <LinkStatic>sequelize.define("activation_links", {
    link_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    link: {
      type: DataTypes.STRING,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}
