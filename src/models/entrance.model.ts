import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface EntranceAttributes {
  entrance_id?: number;
  space_id: number;
  user_id: number;
  time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EntranceModel
  extends Model<EntranceAttributes>,
    EntranceAttributes {}

export type EntranceStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): EntranceModel;
};

export function EntranceFactory(sequelize: Sequelize): EntranceStatic {
  return <EntranceStatic>sequelize.define("entrances", {
    entrance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    space_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "spaces",
        key: "space_id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
