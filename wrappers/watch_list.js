const moment = require("moment");
const constants = require("../utilities/constants");

const User = require("../models/User.model");
const WatchList = require("../models/watch_list.model");

const createWatchList = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["user_id", "coin_name"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await WatchList.create(payload);
    console.log("Response", response);
    console.log("Payload", payload);
    return {
      status: true,
      watchList: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

//remove coin from watchlist
const removeCoinFromWatchList = async (user_id, coin_name) => {
  try {
    if (!user_id) throw new Error("id missing from the request");

    let response = await WatchList.destroy({
      where: { user_id, coin_name },
    });

    return {
      status: true,
      watchList: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getWatchList = async () => {
  try {
    let response = await WatchList.findAll({});

    return {
      status: true,
      watchList: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

module.exports = { createWatchList, removeCoinFromWatchList, getWatchList };
