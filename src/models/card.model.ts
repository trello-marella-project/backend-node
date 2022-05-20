import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface CardAttributes {
  card_id?: number;
  block_id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CardModel extends Model<CardAttributes>, CardAttributes {}

export type CardStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): CardModel;
};

export function CardFactory(sequelize: Sequelize): CardStatic {
  return <CardStatic>sequelize.define("cards", {
    card_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    block_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "blocks",
        key: "block_id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
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
