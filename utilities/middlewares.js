const constants = require('./constants')

const sessionWrapper = require('../wrappers/session')

const authentication = async (req, res, next) => {
  try {
    if (!req.get('Token')) throw new Error('Token is missing from the headers')

    const sessionResponse = await sessionWrapper.validateSession(req.get('Token'))
    if (!sessionResponse.status) throw new Error(sessionResponse.message)

    req.user_id = sessionResponse.session.user_id

    next()
  } catch (error) {
    res.json({
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error)
    })
  }
}

module.exports = { authentication }