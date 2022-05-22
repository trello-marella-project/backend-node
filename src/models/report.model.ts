import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface ReportAttributes {
  report_id?: number;
  declarer_user_id: number;
  accused_user_id: number;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReportModel
  extends Model<ReportAttributes>,
    ReportAttributes {}

export type ReportStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ReportModel;
};

export function ReportFactory(sequelize: Sequelize): ReportStatic {
  return <ReportStatic>sequelize.define("reports", {
    report_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    declarer_user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    accused_user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    message: {
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
