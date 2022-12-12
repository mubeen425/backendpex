const constants = require("../utilities/constants");
const AdminWatchListModal = require("../models/admin_watchlist.model");

const createWatchList = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["coin_name"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await AdminWatchListModal.create(payload);
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
const removeCoinFromWatchList = async (coin_name) => {
  try {
    if (!coin_name) throw new Error("id missing from the request");

    let response = await AdminWatchListModal.destroy({
      where: { coin_name },
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
    let response = await AdminWatchListModal.findAll({});

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
