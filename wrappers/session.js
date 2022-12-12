const moment = require("moment");
const { Op } = require("sequelize");
const constants = require("../utilities/constants");

const Session = require("../models/Session.model");
const User = require("../models/User.model");

const createSession = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["user_id"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    payload.token = constants.GENERAL_FUNCTIONS.GET_TOKEN();
    payload.login_timestamp = moment().format("YYYY-MM-DD HH:mm");
    payload.expiry_timestamp = moment().add(30, "m").format("YYYY-MM-DD HH:mm");

    let response = await Session.create(payload);

    return {
      status: true,
      session: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getSession = async (user_id) => {
  try {
    if (!user_id) throw new Error("user_id is missing from the request");

    let response = await Session.findOne({
      where: { user_id },
    });

    if (!response) throw new Error("session not found");

    return {
      status: true,
      session: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const updateUserSession = async (user_id) => {
  try {
    if (!user_id) throw new Error("user_id is missing from the request");

    let response = await Session.findOne({
      where: { user_id },
    });

    if (!response) throw new Error("session not found");

    response.token = constants.GENERAL_FUNCTIONS.GET_TOKEN();
    response.login_timestamp = moment().format("YYYY-MM-DD HH:mm");
    response.expiry_timestamp = moment()
      .add(30, "m")
      .format("YYYY-MM-DD HH:mm");

    response = await response.save();

    return {
      status: true,
      session: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const deleteUserSession = async (token) => {
  try {
    if (!token) throw new Error("token is missing from the request");

    let response = await Session.findOne({
      where: { token },
    });

    if (!response) throw new Error("session not found");

    response.expiry_timestamp = moment()
      .subtract(1, "m")
      .format("YYYY-MM-DD HH:mm");

    response = await response.save();

    return {
      status: true,
      session: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const updateSessionTimestamps = async (user_id) => {
  try {
    if (!user_id) throw new Error("user_id is missing from the request");

    let response = await Session.findOne({
      where: { user_id },
    });

    if (!response) throw new Error("session not found");

    response.login_timestamp = moment().format("YYYY-MM-DD HH:mm");
    response.expiry_timestamp = moment()
      .add(30, "m")
      .format("YYYY-MM-DD HH:mm");

    response = await response.save();

    return {
      status: true,
      session: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const validateSession = async (token) => {
  try {
    if (!token) throw new Error("Access-Token is missing from the request");

    let response = await Session.findOne({
      where: {
        token,
        login_timestamp: {
          [Op.lte]: moment().format("YYYY-MM-DD HH:mm"),
        },
        expiry_timestamp: {
          [Op.gte]: moment().format("YYYY-MM-DD HH:mm"),
        },
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!response) throw new Error("Your session has been expired");

    return {
      status: true,
      session: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getSessionUser = async (token) => {
  try {
    if (!token) throw new Error("token is missing from the request");

    let response = await Session.findOne({
      where: { token },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    console.log(response, "");
    if (!response) throw new Error("user not found");

    return {
      status: true,
      user: response.user,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

module.exports = {
  createSession,
  getSession,
  updateUserSession,
  deleteUserSession,
  updateSessionTimestamps,
  validateSession,
  getSessionUser,
};
