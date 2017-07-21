var path = require('path')
var _ = require('lodash')
var dir = require('node-dir')
var Cache = require('node-cache')
var snake = require('snake-case')
var pug = require('pug')
var field = require('lib/prismic/field')
var htmlDom = require('lib/html')

var cache = new Cache({stdTTL: 0})
var development = process.env.NODE_ENV === 'development'
var basePath = path.resolve(__dirname, '../../../templates/slices')
var extRegex = /\.pug$/

var templateName = function (s) {
  if (!s || !_.isString(s)) return ''
  return snake(s).replace(/_/g, '-').toLowerCase().trim()
}

var renderSlice = function (res, model, slice, f) {
  slice.value = _.map(slice.value, function (value) {
    value.get = function (path) {
      return field(value, path)
    }
    return value
  })
  var html = f(_.extend({}, res.locals, {
    model: model,
    slice: slice
  }))
  var sliceType = templateName(slice.slice_type)
  var modelType = templateName(model.type)
  return html
    ? htmlDom.createElement(
      'div',
      {
        class: [
          'model-' + modelType + '-slice-' + sliceType,
          'slice-' + sliceType
        ]
      },
      html
    )
    : html
}

var processSlice = function (res, model, slice) {
  if (!model || !slice) return null
  var modelType = templateName(model.type)
  var sliceType = templateName(slice.slice_type)
  var sliceTemplates = res.locals.sliceTemplates || {}
  var globalSlice = _.get(sliceTemplates, ['global', sliceType].join('.'))
  var typeSlice = _.get(sliceTemplates, ['types', modelType, sliceType].join('.'))
  if (typeSlice) return renderSlice(res, model, slice, typeSlice)
  if (globalSlice) return renderSlice(res, model, slice, globalSlice)
  return null
}

var getSliceTemplates = function (callback) {
  var sliceTemplates = {
    global: {},
    types: {}
  }
  dir.readFiles(basePath, {
    match: extRegex
  }, function (err, content, file, next) {
    if (err) return next(err)
    file = file.replace(basePath + '/', '')
    file = file.replace(extRegex, '')
    file = file.split('/')
    if (file.length === 1) {
      var type = file[0]
      sliceTemplates.global[type] = pug.compile(content)
    } else if (file.length === 2) {
      var type = file[0]
      var slice = file[1]
      _.set(sliceTemplates, ['types', type, slice].join('.'), pug.compile(content))
    }
    next()
  }, function (err) {
    if (err) callback(err)
    callback(null, sliceTemplates)
  })
}

module.exports = function (req, res, next) {
  res.locals.parseSlice = function (model, slice) {
    return processSlice(res, model, slice)
  }
  res.locals.parseSlices = function (model, data) {
    return _(data)
      .map(function (slice) {
        return res.locals.parseSlice(model, slice)
      })
      .filter(function (html) {
        return !!html
      })
      .value()
      .join('')
  }
  var cached = cache.get('sliceTemplates')
  if (!development && cached) {
    res.locals.sliceTemplates = cached
    return next()
  }
  getSliceTemplates(function (err, sliceTemplates) {
    if (err) return next(err)
    cache.set('sliceTemplates', sliceTemplates)
    res.locals.sliceTemplates = sliceTemplates
    next(err)
  })
}
