import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Car = sequelize.define("Car", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  make: { type: DataTypes.STRING, allowNull: true },
  model: { type: DataTypes.STRING, allowNull: true },
  year: { type: DataTypes.INTEGER, allowNull: true },
  color: { type: DataTypes.STRING, allowNull: true }
});

export default Car;