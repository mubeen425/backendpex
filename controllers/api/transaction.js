const middlewares = require('../../utilities/middlewares')
const transactionWrapper = require('../../wrappers/transaction')

module.exports = (router) => {
  router.post('/transaction', async (req, res, next) => {
    res.json(await transactionWrapper.createTransaction(req.body))
  })

  router.put('/transaction', async (req, res, next) => {
    res.json(await transactionWrapper.updateTransaction(req.body))
  })

  router.delete('/transaction', async (req, res, next) => {
    res.json(await transactionWrapper.deleteTransaction(req.body.id))
  })

  router.get('/transactions', async (req, res, next) => {
    res.json(await transactionWrapper.getTransactions(req.query))
  })

  router.get('/transaction/:id', async (req, res, next) => {
    res.json(await transactionWrapper.getTransaction(req.params.id))
  })
  
  router.get('/transactions/:user_id', async (req, res, next) => {
    res.json(await transactionWrapper.getTransactionByUSer(req.params.user_id))
  })

  router.post('/transaction/transfer', middlewares.authentication, async (req, res, next) => {
    res.json(await transactionWrapper.transfer(req.user_id, req.body))
  })

  router.post('/transaction/hook', async (req, res, next) => {
    res.json(await transactionWrapper.hook(req.body))
  })
}