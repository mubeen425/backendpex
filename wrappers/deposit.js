const moment = require("moment");
const constants = require("../utilities/constants");

const User = require("../models/User.model");
const deposit_requests = require("../models/deposit.model");
const walletWrapper = require("../wrappers/wallet");

const createDepositRequests = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["amount", "user_id"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    payload.requested_at = moment().format("YYYY-MM-DD HH:mm");
    payload.request_status = "Pending";

    let response = await deposit_requests.create(payload, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
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

const updateDepositRequests = async (payload) => {
  try {
    if (!payload.request_status)
      throw new Error("request_status missing from the request");
    if (!payload.updated_by)
      throw new Error("updated_by missing from the request");

    let response = await deposit_requests.findOne({
      where: { id: payload.id },
    });

    if (!response) throw new Error("deposit_requests not found");

    // if (payload.balance) response.balance = payload.balance;
    // if (payload.totalInvested) response.totalInvested = payload.totalInvested;
    // if (payload.updated_by) response.updated_by = payload.updated_by;
    if (payload.status_description)
      response.status_description = payload.status_description;
    if (payload.updated_by) response.updated_by = payload.updated_by;

    response.updated_at = moment().format("YYYY-MM-DD HH:mm");
    console.log(
      response.request_status,
      payload.request_status,
      response.request_status == "Pending" &&
        payload.request_status == "Approved"
    );
    if (
      response.request_status == "Pending" &&
      payload.request_status == "Approved" &&
      response.type == "Deposit"
    ) {
      await walletWrapper.debitBalance({
        user_id: response.user_id,
        balance: response.amount,
      });
    } else if (
      response.request_status == "Pending" &&
      payload.request_status == "Approved" &&
      response.type == "Withdraw"
    ) {
      await walletWrapper.creditBalance({
        user_id: response.user_id,
        balance: response.amount,
      });
    }

    if (payload.request_status)
      response.request_status = payload.request_status;
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

const deleteDepositRequests = async (id) => {
  try {
    if (!id) throw new Error("id missing from the request");

    let response = await deposit_requests.destroy({
      where: { id },
    });

    return {
      status: true,
      deposit_requests: response,
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

const getDepositRequests = async (params) => {
  console.log(params);
  try {
    let response = await deposit_requests.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: getParams(params),
    });

    return {
      status: true,
      DepositRequests: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getDepositRequest = async (user_id) => {
  try {
    if (!user_id) throw new Error("user_id missing from the request");

    let response = await deposit_requests.findOne({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: { user_id },
    });

    if (!response) throw new Error("deposit_requests not found");

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
  createDepositRequests,
  updateDepositRequests,
  deleteDepositRequests,
  getDepositRequests,
  getDepositRequest,
};
