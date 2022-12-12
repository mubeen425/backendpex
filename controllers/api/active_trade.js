const depositRequestsWrapper = require('../../wrappers/active_trade')

module.exports = (router) => {
  router.post('/active_trade', async (req, res, next) => {
    res.json(await depositRequestsWrapper.createActiveTradeRequests(req.body))
  })

  router.put('/active_trade', async (req, res, next) => {
    res.json(await depositRequestsWrapper.updateActiveTradeRequests(req.body))
  })

  router.delete('/active_trades/:id', async (req, res, next) => {
    res.json(await depositRequestsWrapper.deleteActiveTradeRequests(req.params.id))
  })

  router.get('/active_trades', async (req, res, next) => {
    res.json(await depositRequestsWrapper.getActiveTradeRequests(req.query))
  })

  router.get('/active_trades/:user_id', async (req, res, next) => {
    res.json(await depositRequestsWrapper.getActiveTradeRequest(req.params.user_id))
  })
}