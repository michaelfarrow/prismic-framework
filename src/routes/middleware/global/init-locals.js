var _ = require('lodash')
var importer = require('lib/importer')(__dirname)
var importedLocals = importer.import('./locals')

var libs = {
  _: 'lodash'
}

module.exports = function (req, res, next) {
  var imporedtLibs = _.mapValues(libs, function (lib) {
    return require(lib)
  })

  var locals = _.extend(
    {},
    importedLocals,
    imporedtLibs
  )

  res.locals = locals
  next()
}
