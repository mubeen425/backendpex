const moment = require("moment");
const { Op } = require("sequelize");
const constants = require("../utilities/constants");

const User = require("../models/User.model");

const sessionWrapper = require("./session");

const createUser = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      [
        "displayName",
        "firstName",
        "lastName",
        "email",
        "password",
      ],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    payload.password = await constants.GENERAL_FUNCTIONS.ENCRYPT_PASSWORD(
      payload.password
    );
    payload.created_at = moment().format("YYYY-MM-DD HH:mm");
    payload.updated_at = moment().format("YYYY-MM-DD HH:mm");

    if (!payload.description) payload.description = null;
    if (!payload.avatar) payload.avatar = null;
    if (!payload.balance) payload.balance = 0;
    if (!payload.status) payload.status = "logged out";

    let response = await User.create(payload);

    
    response = await response.save();

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

const updateUser = async (payload) => {
  try {
    if (!payload.id) throw new Error("id missing from the request");

    let response = await User.findOne({
      where: { id: payload.id },
    });

    if (!response) throw new Error("user not found");

    if (payload.name) response.displayName = payload.displayName;
    if (payload.name) response.firstName = payload.firstName;
    if (payload.name) response.lastName = payload.lastName;
    if (payload.contact) response.contact = payload.contact;
    if (payload.email) response.email = payload.email;
    if (payload.id_number) response.id_number = payload.id_number;
    if (payload.id_number) response.balance = payload.balance;
    if (payload.id_number) response.totalInvested = payload.totalInvested;
    if (payload.id_number) response.margin = payload.margin;
    if (payload.id_number) response.pending = payload.pending;
    if (payload.web_device_id) response.web_device_id = payload.web_device_id;

    response.avatar = payload.avatar;
    response.status = payload.status;
    response.updated_at = moment().format("YYYY-MM-DD HH:mm");

    response = await response.save();

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

const deleteUser = async (id) => {
  try {
    if (!id) throw new Error("id missing from the request");

    let response = await User.destroy({
      where: { id },
    });

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

const getParams = (params) => {
  const where = {};

  if (params.id) where.id = params.id;
  if (params.ids)
    where.id = {
      [Op.in]: constants.GENERAL_FUNCTIONS.TO_ARRAY(params.ids),
    };
  if (params.name)
    where.name = {
      [Op.like]: `${params.name}%`,
    };
  if (params.contact) where.contact = params.contact;
  if (params.email)
    where.email = {
      [Op.like]: `${params.email}%`,
    };
  if (params.dob) where.dob = moment(params.dob).format("YYYY-MM-DD");
  if (params.gender) where.gender = params.gender;
  if (params.id_type) where.id_type = params.id_type;
  if (params.id_number) where.id_number = params.id_number;
  if (params.balance) where.balance = params.balance;
  if (params.status) where.status = params.status;

  return where;
};

const getUsers = async (params) => {
  try {
    let response = await User.findAll({
      where: getParams(params),
      attributes: { exclude: ["avatar", "password"] },
    });

    return {
      status: true,
      users: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getUser = async (id) => {
  try {
    if (!id) throw new Error("id missing from the request");

    let response = await User.findOne({
      where: { id },
    });

    if (!response) throw new Error("user not found");

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

const getUserByContact = async (contact, transaction) => {
  try {
    if (!contact) throw new Error("contact missing from the request");

    let response = await User.findOne({
      attributes: {
        exclude: ["password"],
      },
      transaction: transaction,
      where: { contact },
    });

    if (!response) throw new Error("user not found");

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

const getUserByIDNumber = async (id_number, transaction) => {
  try {
    if (!id_number) throw new Error("id number missing from the request");

    let response = await User.findOne({
      attributes: {
        exclude: ["password"],
      },
      transaction: transaction,
      where: { id_number },
    });

    if (!response) throw new Error("user not found");

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

const login = async (payload) => {
  try {
    console.log(payload.contact);
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["email", "password"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await User.findOne({
      where: { email: payload.email },
    });

    console.log(response);
    if (!response) throw new Error("Invalid contact or password");

    const comparison = await constants.GENERAL_FUNCTIONS.COMPARE_PASSWORD(
      payload.password,
      response.password
    );
    if (!comparison) throw new Error("Invalid contact or password");

    response.status = "logged in";
    response = await response.save();

    // let session = await sessionWrapper.getSession(response.id);

    // if (!session.status) {
    //   session = await sessionWrapper.createSession({ user_id: response.id });
    //   if (!session.status) throw new Error(session.message);

    //   session = session.session;
    // } else {
    //   const token = session.session.token;
    //   const validate = await sessionWrapper.validateSession(token);
    //   if (validate.status) {
    //     session = await sessionWrapper.updateSessionTimestamps(response.id);
    //     if (!session.status) throw new Error(session.message);

    //     session = session.session;
    //   } else {
    //     session = await sessionWrapper.updateUserSession(response.id);
    //     if (!session.status) throw new Error(session.message);

    //     session = session.session;
    //   }
    // }

    return {
      status: true,
      user: response,
      // token: session.token,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const logout = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["contact"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await User.findOne({
      where: { contact: payload.contact },
    });

    if (!response) throw new Error("user not found");

    response.status = "logged out";
    response = await response.save();

    const sessionResponse = await sessionWrapper.deleteUserSession(
      payload.token
    );
    if (!sessionResponse.status) throw new Error(sessionResponse.message);

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

const forgotPin = async (payload) => {
  try {
    if (!payload.id) throw new Error("id missing from the request");

    let response = await User.findOne({
      where: { id: payload.id },
    });

    response.password = await constants.GENERAL_FUNCTIONS.ENCRYPT_PASSWORD(
      payload.password
    );
    response = await response.save();

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

const updatePin = async (payload) => {
  try {
    if (!payload.id) throw new Error("id missing from the request");

    let response = await User.findOne({
      where: { id: payload.id },
    });

    const comparison = await constants.GENERAL_FUNCTIONS.COMPARE_PASSWORD(
      payload.currentPin,
      response.password
    );
    if (!response) throw new Error("user not found");
    if (comparison) {
      response.password = await constants.GENERAL_FUNCTIONS.ENCRYPT_PASSWORD(
        payload.password
      );
    } else {
      throw new Error("Current password not correct");
    }

    response = await response.save();

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

const debitBalance = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["user_id", "balance"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await User.findOne({
      where: { id: payload.user_id },
    });

    if (!response) throw new Error("user not found");

    response.balance = parseFloat(response.balance) + payload.balance;
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

const creditBalance = async (payload, transaction) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["user_id", "balance"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await User.findOne({
      where: { id: payload.user_id },
    });

    if (!response) throw new Error("user not found");

    response.balance =
      parseFloat(response.balance) - parseFloat(payload.balance);
    response = await response.save();

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

const updateToken = async (payload) => {
  try {
    if (!payload.id) throw new Error("id missing from the request");

    let response = await User.findOne({
      where: { id: payload.id },
    });

    if (!response) throw new Error("user not found");

    if (payload.web_token) response.web_token = payload.web_token;
    if (payload.mobile_token) response.mobile_token = payload.mobile_token;

    response = await response.save();

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

const getToken = async (id) => {
  try {
    if (!id) throw new Error("id missing from the request");

    let response = await User.findOne({
      where: { id: payload.id },
    });

    if (!response) throw new Error("user not found");

    return {
      status: true,
      web_token: response.web_token,
      mobile_token: response.mobile_token,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
  getUserByContact,
  getUserByIDNumber,
  login,
  logout,
  forgotPin,
  updatePin,
  debitBalance,
  creditBalance,
  updateToken,
  getToken,
};
