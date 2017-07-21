var _ = require('lodash')
var md5 = require('md5')
var Prismic = require('prismic-javascript')
var config = require('config/prismic')
var request = require('request')
var NodeCache = require('node-cache')
var field = require('lib/prismic/field')

var production = process.env.NODE_ENV === 'production'
var cacheTTL = production ? 60 * 60 * 24 * 30 : 5

var addFieldMethod = function (parsed) {
  parsed.results = _.map(parsed.results, function (result) {
    if (!result.get) {
      result.get = function (path) {
        return field(result, 'data.' + path)
      }
    }
    return result
  })
  return parsed
}

var Cache = function (limit) {
  // console.log('Cache:init', limit)
  this.cache = new NodeCache({stdTTL: cacheTTL, useClones: false})
}

Cache.prototype.isExpired = function (key) {
  key = this.key(key)
  // var entryValue = this.lru.get(key, false)
  // if (entryValue) {
  //   return entryValue.expiredIn !== 0 && entryValue.expiredIn < Date.now()
  // }else {
  return false
// }
}

Cache.prototype.key = function (str) {
  return md5(str)
}

Cache.prototype.get = function (key, callback) {
  key = this.key(key)
  // console.log('Cache:get', key)
  this.cache.get(key, callback)
}

Cache.prototype.set = function (key, value, ttl, callback) {
  key = this.key(key)
  // console.log('Cache:set', key, ttl)
  this.cache.set(key, value, ttl, callback)
}

Cache.prototype.remove = function (key, callback) {
  key = this.key(key)
  this.cache.del(key, callback)
}

Cache.prototype.clear = function (callback) {
  this.cache.flushAll()
  callback()
}

var apiCache = new Cache

var requestHandler = {
  request: function (url, callback) {
    request(url, function (err, response, body) {
      if (err) return callback(err)
      if (!response) return callback(new Error('No Response'))
      if (response.statusCode !== 200) return callback(new Error('Error ' + response.statusCode))
      var parsed = addFieldMethod(JSON.parse(body))
      callback(null, parsed, response, cacheTTL)
    })
  }
}

module.exports = function (req, res, next) {
  Prismic.api(
    config.apiEndpoint,
    {
      accessToken: config.accessToken,
      apiCache: apiCache,
      requestHandler: requestHandler
    }
  ).then(function (api) {
    req.prismic = api
    req.prismic.req = req
    next()
  }).catch(next)
}
