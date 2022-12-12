const walletWrapper = require('../../wrappers/wallet')

module.exports = (router) => {
  // router.post('/wallet', async (req, res, next) => {
  //   res.json(await walletWrapper.createwallet(req.body))
  // })

  router.put('/wallet', async (req, res, next) => {
    res.json(await walletWrapper.updatewallet(req.body))
  })

  router.delete('/wallet/:id', async (req, res, next) => {
    res.json(await walletWrapper.deletewallet(req.params.id))
  })

  router.get('/wallets', async (req, res, next) => {
    res.json(await walletWrapper.getwallets(req.query))
  })

  router.get('/wallet/:user_id', async (req, res, next) => {
    res.json(await walletWrapper.getwallet(req.params.user_id))
  })
}