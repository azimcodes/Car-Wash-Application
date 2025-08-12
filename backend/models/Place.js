import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Place = sequelize.define("Place", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  availability: { 
    type: DataTypes.ENUM("available", "busy", "closed"), 
    defaultValue: "available" 
  },
  photo: { type: DataTypes.STRING, allowNull: true },
  isOpen: { type: DataTypes.BOOLEAN, defaultValue: true },
  location: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true,
});

export default Place;
