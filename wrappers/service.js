const moment = require('moment')
const constants = require('../utilities/constants')

const Service = require('../models/Service.model')

const createService = async (payload, transaction) => {
  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(['service', 'operator'], payload)
    if (message.length > 0) throw new Error(`${message.join(', ')} missing from the request`)

    payload.created_at = moment().format('YYYY-MM-DD HH:mm')
    payload.updated_at = moment().format('YYYY-MM-DD HH:mm')

    let response = await Service.create(payload, { transaction })

    return {
      status: true,
      service: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const updateService = async (payload, transaction) => {
  try {
    if (!payload.id) throw new Error('id missing from the request')

    let response = await Service.findOne({
      transaction: transaction,
      where: { id: payload.id }
    })

    if (!response) throw new Error('service not found')

    if (payload.service) response.service = payload.service
    if (payload.operator) response.operator = payload.operator
    if (payload.contact) response.contact = payload.contact

    response.meter_number = payload.meter_number
    response.payment_code = payload.payment_code
    response.bloom_pay_id = payload.bloom_pay_id
    response.promotion = payload.promotion
    response.name = payload.name
    response.email = payload.email
    response.bank = payload.bank
    response.iban = payload.iban
    response.updated_at = moment().format('YYYY-MM-DD HH:mm')

    response = await response.save({ transaction })

    return {
      status: true,
      service: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const deleteService = async id => {
  try {
    if (!id) throw new Error('id missing from the request')

    let response = await Service.destroy({
      where: { id }
    })

    return {
      status: true,
      service: response
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

  return where
}

const getServices = async params => {
  try {
    let response = await Service.findAll()

    return {
      status: true,
      services: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

const getService = async id => {
  try {
    let response = await Service.findOne({
      where: { id }
    })

    if (!response) throw new Error('service not found')

    return {
      status: true,
      service: response
    }
  }
  catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    }
  }
}

module.exports = { createService, updateService, deleteService, getServices, getService }