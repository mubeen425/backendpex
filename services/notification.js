const axios = require('axios')
const { KEYS } = require('../utilities/constants')

const send = async (payload) => {
  try {
    if (!payload.to) throw new Error('to is missing from the request')
    if (payload.notification) {
      if (!payload.notification.title) throw new Error('title is missing from the request')
      if (!payload.notification.body) throw new Error('body is missing from the request')
    } else {
      throw new Error('notification is missing from the request')
    }

    const response = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
      headers: {
        'Authorization': `key=${KEYS.AUTHORIZATION_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data && response.data.failure === 1) throw new Error('notification cannot be sent')

    return {
      status: true,
      message: 'notification sent'
    }
  } catch (error) {
    return {
      status: false,
      message: error.message
    }
  }
}

module.exports = { send }