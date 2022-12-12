const adminWatchListWrapper = require("../../wrappers/adminWatchlist");

module.exports = (router) => {
  // router.post('/wallet', async (req, res, next) => {
  //   res.json(await walletWrapper.createwallet(req.body))
  // })

  router.post("/admin/watchList", async (req, res, next) => {
    res.json(await adminWatchListWrapper.createWatchList(req.body));
  });
  router.get("/admin/watchList", async (req, res, next) => {
    res.json(await adminWatchListWrapper.getWatchList());
  });

  router.delete("/admin/watchList/:name", async (req, res, next) => {
    res.json(
      await adminWatchListWrapper.removeCoinFromWatchList(req.params.name)
    );
  });
};
