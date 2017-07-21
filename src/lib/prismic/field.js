var _ = require('lodash')

module.exports = function (object, path) {
  var result = _.get(object, path, null)
  if (_.isObject(result) && _.keys(result).length === 0) return null
  return result
}
