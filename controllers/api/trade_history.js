const depositRequestsWrapper = require('../../wrappers/trade_history')

module.exports = (router) => {
  router.post('/trade_history', async (req, res, next) => {
    res.json(await depositRequestsWrapper.createTradeHistoryRequests(req.body))
  })

  router.put('/trade_history', async (req, res, next) => {
    res.json(await depositRequestsWrapper.updateTradeHistoryRequests(req.body))
  })

  router.delete('/trade_history/:id', async (req, res, next) => {
    res.json(await depositRequestsWrapper.deleteTradeHistoryRequests(req.params.id))
  })

  router.get('/trade_history', async (req, res, next) => {
    res.json(await depositRequestsWrapper.getTradeHistoryRequests(req.query))
  })

  router.get('/trade_history/:user_id', async (req, res, next) => {
    res.json(await depositRequestsWrapper.getTradeHistoryRequest(req.params.user_id))
  })
}