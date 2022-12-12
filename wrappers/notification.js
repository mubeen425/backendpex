const moment = require('moment')
const { Op } = require('sequelize')
const constants = require('../utilities/constants')

const Notification = require('../models/Notification.model')
const User = require('../models/User.model')

const createNotification = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(['user_id'], payload)
    if (message.length > 0) throw new Error(`${message.join(', ')} missing from the request`)

    payload.created_at = moment().format('YYYY-MM-DD HH:mm')
    payload.updated_at = moment().format('YYYY-MM-DD HH:mm')

    let response = await Notification.create(payload)

    return {
      status: true,
      notification: response
    }
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const updateNotification = async (payload) => {
  try {
    if (!payload.id) throw new Error('id missing from the request')

    let response = await Notification.findOne({
      where: { id: payload.id }
    })

    if (!response) throw new Error('notification not found')

    if (payload.title) response.title = payload.title
    if (payload.description) response.description = payload.description
    if (payload.seen) response.seen = true
    if (!payload.seen) response.seen = false

    response.updated_at = moment().format('YYYY-MM-DD HH:mm')

    response = await response.save()

    return {
      status: true,
      notification: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const deleteNotification = async (id) => {
  try {
    if (!id) throw new Error('id missing from the request')

    let response = await Notification.destroy({
      where: { id }
    })

    return {
      status: true,
      notification: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const getParams = (params) => {
  const where = {}

  if (params.id) where.id = params.id
  if (params.ids) where.id = {
    [Op.in]: constants.GENERAL_FUNCTIONS.TO_ARRAY(params.ids)
  }

  return where
}

const getNotifications = async (params) => {
  try {
    let response = await Notification.findAll({
      where: getParams(params)
    })

    return {
      status: true,
      notifications: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const getNotification = async (id) => {
  try {
    if (!id) throw new Error('id missing from the request')

    let response = await Notification.findOne({
      where: { id }
    })

    if (!response) throw new Error('notification not found')

    return {
      status: true,
      notification: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

module.exports = { createNotification, updateNotification, deleteNotification, getNotifications, getNotification }