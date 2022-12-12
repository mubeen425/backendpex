const moment = require("moment");
const constants = require("../utilities/constants");

const User = require("../models/User.model");
const trade_history = require("../models/trade_history.model");
const walletWrapper = require("./wallet");
const activeTradeWrapper = require("./active_trade");
const Active_Trade = require("../models/Active_Trade.model");

const createTradeHistoryRequests = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["trade_id", "amount", "closed_price"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    payload.amount = parseFloat(payload.amount);
    payload.profit = parseFloat(payload.profit);
    payload.loss = parseFloat(payload.loss);
    payload.closed_price = parseFloat(payload.closed_price);
    payload.Percentage = 0;

    let am =
      parseFloat(payload.amount) +
      parseFloat(payload.profit) -
      Math.abs(parseFloat(payload.loss));
    let response = await trade_history.create(payload, {
      include: [
        {
          model: Active_Trade,
          as: "active_trade",
        },
      ],
    });

    console.log(am, "am");

    await activeTradeWrapper.debitTradeBalance({
      id: payload.trade_id,
      amount: am.toString(),
    });

    return {
      status: true,
      deposit_request: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const updateTradeHistoryRequests = async (payload) => {
  try {
    if (!payload.id) throw new Error("id missing from the request");

    let response = await trade_history.findOne({
      where: { id: payload.id },
    });

    if (!response) throw new Error("trade_history not found");

    if (payload.status_description)
      response.status_description = payload.status_description;
    if (payload.crypto_name) response.crypto_name = payload.crypto_name;
    if (payload.crypto_purchase_price)
      response.crypto_purchase_price = payload.crypto_purchase_price;
    if (payload.investment) response.investment = payload.investment;
    if (payload.trade) response.trade = payload.trade;
    if (payload.admin_profit) response.admin_profit = payload.admin_profit;
    if (payload.trade_loss_end)
      response.trade_loss_end = payload.trade_loss_end;
    if (payload.status) response.status = payload.status;

    response.updated_at = moment().format("YYYY-MM-DD HH:mm");
    response = await response.save();

    return {
      status: true,
      deposit_request: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const deleteTradeHistoryRequests = async (id) => {
  try {
    if (!id) throw new Error("id missing from the request");

    let response = await trade_history.destroy({
      where: { id },
    });

    return {
      status: true,
      trade_history: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getParams = (params) => {
  const where = {};

  if (params.id) where.id = params.id;
  if (params.ids)
    where.id = {
      [Op.in]: constants.GENERAL_FUNCTIONS.TO_ARRAY(params.ids),
    };
  if (params.trade_id) where.trade_id = params.trade_id;
  if (params.user_id) where.active_trade.user_id = params.user_id;

  return where;
};

const getTradeHistoryRequests = async (params) => {
  console.log(params);
  try {
    let response = await trade_history.findAll({
      include: [
        {
          model: Active_Trade,
          as: "active_trade",
        },
      ],
      where: getParams(params),
    });

    return {
      status: true,
      tradeHistory: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getTradeHistoryRequest = async (user_id) => {
  try {
    if (!user_id) throw new Error("user_id missing from the request");

    let response = await trade_history.findOne({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: { user_id },
    });

    if (!response) throw new Error("trade_history not found");

    return {
      status: true,
      deposit_request: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

module.exports = {
  createTradeHistoryRequests,
  updateTradeHistoryRequests,
  deleteTradeHistoryRequests,
  getTradeHistoryRequests,
  getTradeHistoryRequest,
};
