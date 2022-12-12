const moment = require('moment')
const { Op } = require('sequelize')
const constants = require('../utilities/constants')

const Promotion = require('../models/Promotion.model')

const createPromotion = async (payload) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(['title', 'service', 'operator', 'value', 'start_date', 'end_date'], payload)
    if (message.length > 0) throw new Error(`${message.join(', ')} missing from the request`)

    payload.service = JSON.stringify(payload.service)
    payload.start_date = moment(payload.start_date).format('YYYY-MM-DD')
    payload.end_date = moment(payload.end_date).format('YYYY-MM-DD')
    payload.created_at = moment().format('YYYY-MM-DD HH:mm')
    payload.updated_at = moment().format('YYYY-MM-DD HH:mm')

    let response = await Promotion.create(payload)

    return {
      status: true,
      promotion: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const updatePromotion = async (payload) => {
  try {
    if (!payload.id) throw new Error('id missing from the request')

    let response = await Promotion.findOne({
      where: { id: payload.id }
    })

    if (!response) throw new Error('promotion not found')

    if (payload.title) response.title = payload.title
    if (payload.service) response.service = JSON.stringify(payload.service)
    if (payload.operator) response.operator = payload.operator
    if (payload.value) response.value = payload.value
    if (payload.start_date) response.start_date = moment(payload.start_date).format('YYYY-MM-DD')
    if (payload.end_date) response.end_date = moment(payload.end_date).format('YYYY-MM-DD')
    if (payload.transactions) response.transactions = payload.transactions

    response.updated_at = moment().format('YYYY-MM-DD HH:mm')

    response = await response.save()

    return {
      status: true,
      promotion: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const deletePromotion = async (id) => {
  try {
    if (!id) throw new Error('id missing from the request')

    let response = await Promotion.destroy({
      where: { id }
    })

    return {
      status: true,
      promotion: response
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

const getPromotions = async (params) => {
  try {
    let response = await Promotion.findAll({
      where: getParams(params)
    })

    return {
      status: true,
      promotions: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const getPromotion = async (id) => {
  try {
    if (!id) throw new Error('id missing from the request')

    let response = await Promotion.findOne({
      where: { id }
    })

    if (!response) throw new Error('promotion not found')

    return {
      status: true,
      promotion: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

module.exports = { createPromotion, updatePromotion, deletePromotion, getPromotions, getPromotion }