var express = require('express')
var app = express.Router()
var importer = require('lib/importer')(__dirname)
var views = importer.import('./views')

app.get('/', views.index)
app.get('/preview', views.preview)
app.post('/webhook', views.webhook)
app.get('/:uid', views.page)

module.exports = app
