const moment = require('moment')
const constants = require('../utilities/constants')

const User = require('../models/User.model')
const wallet = require('../models/Wallet.model')

const createwallet = async payload => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(['balance', 'totalInvested', 'margin', 'pending', 'user_id'], payload)
    if (message.length > 0) throw new Error(`${message.join(', ')} missing from the request`)

    payload.margin = moment(payload.margin).format('YYYY-MM-DD')
    payload.created_at = moment().format('YYYY-MM-DD HH:mm')
    payload.updated_at = moment().format('YYYY-MM-DD HH:mm')

    let response = await wallet.create(payload)

    return {
      status: true,
      wallet: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const updatewallet = async payload => {
  try {
    if (!payload.user_id) throw new Error('User Id missing from the request')

    let response = await wallet.findOne({
      where: { user_id: payload.user_id }
    })

    if (!response) throw new Error('wallet not found')

    if (payload.balance) response.balance = payload.balance
    if (payload.totalInvested) response.totalInvested = payload.totalInvested
    if (payload.margin) response.margin = payload.margin
    if (payload.pending) response.pending = payload.pending

    response.updated_at = moment().format('YYYY-MM-DD HH:mm')

    response = await response.save()

    return {
      status: true,
      wallet: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const deletewallet = async id => {
  try {
    if (!id) throw new Error('id missing from the request')

    let response = await wallet.destroy({
      where: { id }
    })

    return {
      status: true,
      wallet: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const getParams = params => {
  const where = {}

  if (params.id) where.id = params.id
  if (params.ids) where.id = {
    [Op.in]: constants.GENERAL_FUNCTIONS.TO_ARRAY(params.ids)
  }
  if (params.balance) where.balance = {
    [Op.like]: `${params.balance}%`
  }
  if (params.user_id) where.user_id = params.user_id
  if (params.user_ids) where.user_id = {
    [Op.in]: constants.GENERAL_FUNCTIONS.TO_ARRAY(params.user_ids)
  }

  return where
}

const getwallets = async (params) => {
  try {
    let response = await wallet.findAll({
      include: [{
        model: User,
        as: 'user'
      }],
      where: getParams(params)
    })

    return {
      status: true,
      wallets: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const getwallet = async (user_id) => {
  try {
    if (!user_id) throw new Error('user_id missing from the request')

    let response = await wallet.findOne({
      include: [{
        model: User,
        as: 'user'
      }],
      where: { user_id }
    })

    if (!response) throw new Error('wallet not found')

    return {
      status: true,
      wallet: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const debitBalance = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["user_id", "balance"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await wallet.findOne({
      where: { id: payload.user_id },
    });

    if (!response) throw new Error("user not found");

    response.balance = parseFloat(response.balance) + parseFloat(payload.balance);
    response = response.save();

    console.log(response);
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


const creditBalance = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["user_id", "balance"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    let response = await wallet.findOne({
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


module.exports = { createwallet, updatewallet, deletewallet, getwallets, getwallet,creditBalance, debitBalance }