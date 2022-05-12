import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface TagAttributes {
  tag_id?: number;
  space_id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TagModel extends Model<TagAttributes>, TagAttributes {}

export type TagStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TagModel;
};

export function TagFactory(sequelize: Sequelize): TagStatic {
  return <TagStatic>sequelize.define("tags", {
    tag_id: {
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
