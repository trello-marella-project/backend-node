import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface SpaceAttributes {
  space_id?: number;
  user_id: number;
  name: string;
  is_public: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SpaceModel extends Model<SpaceAttributes>, SpaceAttributes {}

export type SpaceStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): SpaceModel;
};

export function SpaceFactory(sequelize: Sequelize): SpaceStatic {
  return <SpaceStatic>sequelize.define("spaces", {
    space_id: {
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
    is_public: {
      type: DataTypes.BOOLEAN,
    },
    name: {
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
