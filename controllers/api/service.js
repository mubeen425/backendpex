const serviceWrapper = require('../../wrappers/service')

module.exports = (router) => {
  router.post('/service', async (req, res, next) => {
    res.json(await serviceWrapper.createService(req.body))
  })

  router.put('/service', async (req, res, next) => {
    res.json(await serviceWrapper.updateService(req.body))
  })

  router.delete('/service/:id', async (req, res, next) => {
    res.json(await serviceWrapper.deleteService(req.params.id))
  })

  router.get('/services', async (req, res, next) => {
    res.json(await serviceWrapper.getServices(req.query))
  })

  router.get('/service/:id', async (req, res, next) => {
    res.json(await serviceWrapper.getService(req.params.id))
  })
}