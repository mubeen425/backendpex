const notificationService = require('../../services/notification')

module.exports = (router) => {
  router.post('/notification', async (req, res, next) => {
    res.json(await notificationService.send(req.body))
  })
}