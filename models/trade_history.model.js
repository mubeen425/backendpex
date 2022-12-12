const { DataTypes } = require("sequelize");
const connection = require("../utilities/connection");

const Active_Trade = require("./Active_Trade.model");

const Trade_history = connection.define(
  "trade_history",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    closed_price: {
      type: DataTypes.FLOAT,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    profit: {
      type: DataTypes.FLOAT,
    },
    loss: {
      type: DataTypes.FLOAT,
    },
    Percentage: {
      type: DataTypes.FLOAT,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    trade_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Active_Trade,
        key: "id",
      },
    },
  },
  {
    tableName: "trade_history",
    timestamps: false,
  }
);

Trade_history.belongsTo(Active_Trade, {
  as: "active_trade",
  foreignKey: "trade_id",
});

module.exports = Trade_history;
