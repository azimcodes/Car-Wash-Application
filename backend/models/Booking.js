import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',    // or User model name
      key: 'id'
    }
  },
        placeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Places',
          key: 'id'
        }
      },
  carInfo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bookingDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "cancelled"),
    defaultValue: "pending",
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // unpaid by default
  },
  paymentMethod: {
    type: DataTypes.ENUM("pay_now", "pay_at_place"),
    allowNull: true, // filled after choosing payment
  },
});

export default Booking;
