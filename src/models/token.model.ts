import { DataTypes, Sequelize, Model, BuildOptions } from "sequelize";

export interface TokenAttributes {
  token_id?: number;
  user_id: number;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TokenModel extends Model<TokenAttributes>, TokenAttributes {}

export type TokenStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TokenModel;
};

export function TokenFactory(sequelize: Sequelize): TokenStatic {
  return <TokenStatic>sequelize.define("tokens", {
    token_id: {
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
    token: {
      type: DataTypes.STRING,
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
