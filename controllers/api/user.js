const middlewares = require('../../utilities/middlewares')
const userWrapper = require("../../wrappers/user");
const sessionWrapper = require("../../wrappers/session");

module.exports = (router) => {
  router.post("/user", async (req, res, next) => {
    res.json(await userWrapper.createUser(req.body));
  });

  router.put("/user", async (req, res, next) => {
    res.json(await userWrapper.updateUser(req.body));
  });

  router.delete("/user/:id", async (req, res, next) => {
    res.json(await userWrapper.deleteUser(req.params.id));
  });

  router.get("/users", async (req, res, next) => {
    res.json(await userWrapper.getUsers(req.query));
  });

  router.get("/user/:id", async (req, res, next) => {
    res.json(await userWrapper.getUser(req.params.id));
  });

  router.get("/user", middlewares.authentication, async (req, res, next) => {
    res.json(await sessionWrapper.getSessionUser(req.query.token));
  });

  router.post("/user/login", async (req, res, next) => {
    res.json(await userWrapper.login(req.body));
  });

  router.post("/user/logout", async (req, res, next) => {
    res.json(await userWrapper.logout(req.body));
  });

  router.post("/user/password/forgot", async (req, res, next) => {
    res.json(await userWrapper.forgotPin(req.body));
  });

  router.post("/user/password/update", async (req, res, next) => {
    res.json(await userWrapper.updatePin(req.body));
  });

  router.post("/user/balance/debit", async (req, res, next) => {
    res.json(await userWrapper.debitBalance(req.body));
  });

  router.post("/user/balance/credit", async (req, res, next) => {
    res.json(await userWrapper.creditBalance(req.body));
  });

  router.put("/user/token", async (req, res, next) => {
    res.json(await userWrapper.updateToken(req.body));
  });
};
