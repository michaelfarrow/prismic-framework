var _ = require('lodash')

var shortcuts = [
  'references'
]

var Context = function () {
  this.data = {}
  var self = this
  _.each(shortcuts, function (key) {
    if (!self[key]) {
      self[key] = _.mapValues(Context.prototype, function (method, name) {
        return function () {
          var args = [].slice.call(arguments)
          args.unshift(key)
          return self[name].apply(self, args)
        }
      })
    }
  })
}

Context.prototype.get = function (path, defaultVal) {
  return _.get(this.data, path, defaultVal)
}

Context.prototype.set = function (path, value) {
  _.set(this.data, path, value)
  return this.get(path)
}

Context.prototype.push = function (path, value) {
  this.set(path + '.' + this.get(path, []).length, value)
  return this.get(path)
}

module.exports = Context
