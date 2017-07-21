var _ = require('lodash')
var express = require('express')
var app = express.Router()
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.all('*', require('./middleware/prismic'))

var importer = require('lib/importer')(__dirname)
var middleware = importer.import('./middleware/global')

_.each(_.values(middleware), function (f) {
  app.all('*', f)
})

app.all('*', require('./middleware/dom'))

module.exports = app
