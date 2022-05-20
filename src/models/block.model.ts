import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface BlockAttributes {
  block_id?: number;
  space_id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlockModel extends Model<BlockAttributes>, BlockAttributes {}

export type BlockStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): BlockModel;
};

export function BlockFactory(sequelize: Sequelize): BlockStatic {
  return <BlockStatic>sequelize.define("blocks", {
    block_id: {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
