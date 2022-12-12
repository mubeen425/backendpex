const { DataTypes } = require("sequelize");
const connection = require("../utilities/connection");

const AdminWatchList = connection.define(
  "adminWatchList",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    coin_name: {
      type: DataTypes.TEXT,
    },

    // created_at: {
    //   type: DataTypes.DATE,
    // },
    // updated_at: {
    //   type: DataTypes.DATE,
    // },
  },
  {
    tableName: "adminWatchList",
    timestamps: false,
  }
);

module.exports = AdminWatchList;
