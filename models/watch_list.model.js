const { DataTypes } = require("sequelize");
const connection = require("../utilities/connection");

const WatchList = connection.define(
  "watchList",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
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
    tableName: "watchList",
    timestamps: false,
  }
);

module.exports = WatchList;
