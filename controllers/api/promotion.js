const promotionWrapper = require('../../wrappers/promotion')

module.exports = (router) => {
  router.post('/promotion', async (req, res, next) => {
    res.json(await promotionWrapper.createPromotion(req.body))
  })

  router.put('/promotion', async (req, res, next) => {
    res.json(await promotionWrapper.updatePromotion(req.body))
  })

  router.delete('/promotion/:id', async (req, res, next) => {
    res.json(await promotionWrapper.deletePromotion(req.params.id))
  })

  router.get('/promotions', async (req, res, next) => {
    res.json(await promotionWrapper.getPromotions(req.query))
  })

  router.get('/promotion/:id', async (req, res, next) => {
    res.json(await promotionWrapper.getPromotion(req.params.id))
  })
}