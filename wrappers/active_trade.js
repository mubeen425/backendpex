const moment = require("moment");
const constants = require("../utilities/constants");

const wallet = require("../models/wallet.model");
const User = require("../models/User.model");
const active_trades = require("../models/active_trade.model");
const walletWrapper = require("./wallet");
const Trade_history = require("../models/trade_history.model");

const createActiveTradeRequests = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["crypto_purchase_price", "investment", "user_id"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let userWallet = await wallet.findOne({
      where: { id: payload.user_id },
    });
    if (userWallet.balance > payload.investment) {
      payload.trade = parseFloat(payload.investment) * 0.985;
      payload.admin_profit = parseFloat(payload.investment) * 0.015;
      payload.invested_date = moment().format("YYYY-MM-DD HH:mm");
      payload.status = "Open";

      let response = await active_trades.create(payload, {
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      });

      await walletWrapper.creditBalance({
        user_id: payload.user_id,
        balance: parseFloat(payload.investment),
      });

      return {
        status: true,
        deposit_request: response,
      };
    } else {
      throw new Error(`You can't open trade more then balance`);
    }
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const updateActiveTradeRequests = async (payload) => {
  try {
    if (!payload.id) throw new Error("id missing from the request");

    let response = await active_trades.findOne({
      where: { id: payload.id },
    });

    if (!response) throw new Error("active_trades not found");

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

    if (payload.status == "Close") {
      let amount =
        parseFloat(payload.amount) > 0
          ? parseFloat(payload.amount)
          : parseFloat(response.investment);
      console.log(response.user_id, payload.investment);
      await walletWrapper.debitBalance({
        user_id: response.user_id,
        balance: amount + parseFloat(payload.profit) - parseFloat(payload.loss),
      });
    }
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

const debitTradeBalance = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["id", "amount"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await active_trades.findOne({
      where: { id: payload.id },
    });

    console.log(response, "response");
    response.trade =
      parseFloat(response.trade) - Math.abs(parseFloat(payload.amount));
    response.admin_profit =
      parseFloat(response.admin_profit) +
      Math.abs(parseFloat(payload.amount)) * 0.015;
    if (response.trade <= 0) {
      response.status = "Close";
    }
    await walletWrapper.debitBalance({
      user_id: response.user_id,
      balance: payload.amount,
    });
    response = response.save();
    return {
      status: true,
      user: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const deleteActiveTradeRequests = async (id) => {
  try {
    if (!id) throw new Error("id missing from the request");

    let response = await active_trades.destroy({
      where: { id },
    });

    return {
      status: true,
      active_trades: response,
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
  if (params.balance)
    where.balance = {
      [Op.like]: `${params.balance}%`,
    };
  if (params.user_id) where.user_id = params.user_id;
  if (params.user_ids)
    where.user_id = {
      [Op.in]: constants.GENERAL_FUNCTIONS.TO_ARRAY(params.user_ids),
    };

  return where;
};

const getActiveTradeRequests = async (params) => {
  console.log(params);
  try {
    let response = await active_trades.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
        //  {
        //   model: Trade_history,
        //   as: 'trade_history'
        // }
      ],
      where: getParams(params),
    });

    return {
      status: true,
      ActiveTradeRequests: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getActiveTradeRequest = async (user_id) => {
  try {
    if (!user_id) throw new Error("user_id missing from the request");

    let response = await active_trades.findOne({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: { user_id },
    });

    if (!response) throw new Error("active_trades not found");

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
  createActiveTradeRequests,
  updateActiveTradeRequests,
  debitTradeBalance,
  deleteActiveTradeRequests,
  getActiveTradeRequests,
  getActiveTradeRequest,
};
