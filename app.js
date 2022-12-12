var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var compression = require('compression')
var connection = require('./utilities/connection')

try {
  connection.authenticate()
} catch (error) {
  console.error('Unable to connect to the database: ', error)
}

var apiRouter = require('./routes/api')
var serviceRouter = require('./routes/service')

var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'build')))
app.use(cors())
app.use(compression())

app.use('/api', apiRouter)
app.use('/service', serviceRouter)

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (error, req, res, next) {
  res.locals.message = error.message
  res.locals.error = req.app.get('env') === 'development' ? error : {}

  res
    .status(error.status || 500)
    .json(error)
})

module.exports = app
