const { DataTypes } = require("sequelize");
const connection = require("../utilities/connection");
const Trade_history = require("./trade_history.model");

const User = require("./User.model");

const Active_Trade = connection.define(
  "active_trade",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    crypto_name: {
      type: DataTypes.TEXT,
    },
    crypto_purchase_price: {
      type: DataTypes.FLOAT,
    },
    investment: {
      type: DataTypes.FLOAT,
    },
    trade: {
      type: DataTypes.FLOAT,
    },
    admin_profit: {
      type: DataTypes.FLOAT,
    },
    trade_profit_end: {
      type: DataTypes.FLOAT,
    },
    trade_loss_end: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.TEXT,
    },
    count_id: {
      type: DataTypes.FLOAT,
    },
    invested_date: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "active_trade",
    timestamps: false,
  }
);

Active_Trade.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
});

// Active_Trade.hasMany(Trade_history, { as: "trade_history", foreignKey: "trade_id", });

module.exports = Active_Trade;
