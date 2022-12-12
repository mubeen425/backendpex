const depositRequestsWrapper = require('../../wrappers/deposit')

module.exports = (router) => {
  router.post('/deposit_request', async (req, res, next) => {
    res.json(await depositRequestsWrapper.createDepositRequests(req.body))
  })

  router.put('/deposit_request', async (req, res, next) => {
    res.json(await depositRequestsWrapper.updateDepositRequests(req.body))
  })

  router.delete('/deposit_requests/:id', async (req, res, next) => {
    res.json(await depositRequestsWrapper.deleteDepositRequests(req.params.id))
  })

  router.get('/deposit_requests', async (req, res, next) => {
    res.json(await depositRequestsWrapper.getDepositRequests(req.query))
  })

  router.get('/deposit_requests/:user_id', async (req, res, next) => {
    res.json(await depositRequestsWrapper.getDepositRequest(req.params.user_id))
  })
}