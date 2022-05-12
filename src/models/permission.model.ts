import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface PermissionAttributes {
  permission_id?: number;
  space_id: number;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissionModel
  extends Model<PermissionAttributes>,
    PermissionAttributes {}

export type PermissionStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): PermissionModel;
};

export function PermissionFactory(sequelize: Sequelize): PermissionStatic {
  return <PermissionStatic>sequelize.define("permissions", {
    permission_id: {
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
