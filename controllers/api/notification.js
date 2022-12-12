const notificationWrapper = require('../../wrappers/notification')

module.exports = (router) => {
  router.post('/notification', async (req, res, next) => {
    res.json(await notificationWrapper.createNotification(req.body))
  })

  router.put('/notification', async (req, res, next) => {
    res.json(await notificationWrapper.updateNotification(req.body))
  })

  router.delete('/notification/:id', async (req, res, next) => {
    res.json(await notificationWrapper.deleteNotification(req.params.id))
  })

  router.get('/notifications', async (req, res, next) => {
    res.json(await notificationWrapper.getNotifications(req.query))
  })

  router.get('/notification/:id', async (req, res, next) => {
    res.json(await notificationWrapper.getNotification(req.params.id))
  })
}