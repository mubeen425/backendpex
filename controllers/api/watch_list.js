const watchListWrapper = require("../../wrappers/watch_list");

module.exports = (router) => {
  // router.post('/wallet', async (req, res, next) => {
  //   res.json(await walletWrapper.createwallet(req.body))
  // })

  router.post("/watchList", async (req, res, next) => {
    res.json(await watchListWrapper.createWatchList(req.body));
  });
  router.get("/watchList", async (req, res, next) => {
    res.json(await watchListWrapper.getWatchList());
  });

  router.delete("/watchList/:id/:name", async (req, res, next) => {
    res.json(
      await watchListWrapper.removeCoinFromWatchList(
        req.params.id,
        req.params.name
      )
    );
  });

  // router.delete('/wallet/:id', async (req, res, next) => {
  //   res.json(await walletWrapper.deletewallet(req.params.id))
  // })

  // router.get('/wallets', async (req, res, next) => {
  //   res.json(await walletWrapper.getwallets(req.query))
  // })

  // router.get('/wallet/:user_id', async (req, res, next) => {
  //   res.json(await walletWrapper.getwallet(req.params.user_id))
  // })
};
