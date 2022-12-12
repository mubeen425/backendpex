var express = require('express')
var router = express.Router()

require('../controllers/service/notification')(router)

module.exports = router