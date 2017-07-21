require('app-module-path').addPath(__dirname)
var express = require('express')
var morgan = require('morgan')

morgan.token('remote-addr', function (req, res) {
  return req.headers['x-forwarded-for'] || req.ip
})

var app = express()
var development = process.env.NODE_ENV === 'development'

app.set('view engine', 'pug')
app.set('views', './templates/views')

app.use(express.static('public'))
app.use(morgan(development ? 'dev' : ':remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))

require('./routes')(app)
require('./utils/watch')

app.listen(process.env.PORT || 80)
