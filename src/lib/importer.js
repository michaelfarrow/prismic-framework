var _ = require('lodash')
var fs = require('fs')
var path = require('path')

var Importer = function (rootDir) {
  this.rootDir = rootDir
  this.imported = {}
}

Importer.prototype.import = function (from) {
  // debug('importing ', from)
  var self = this
  var joinPath = function () {
    return '.' + path.sep + path.join.apply(path, arguments)
  }

  var fsPath = joinPath(path.relative(process.cwd(), self.rootDir), from)
  fs.readdirSync(fsPath).forEach(function (name) {
    var info = fs.statSync(path.join(fsPath, name))
    // debug('recur')
    if (info.isDirectory()) {
      // imported[name] = importer(joinPath(from, name))
    } else {
      // only import files that we can `require`
      var ext = path.extname(name)
      var base = path.basename(name, ext)
      if (require.extensions[ext]) {
        self.imported[base] = {
          from: from,
          name: name
        }
      } else {
        // debug('cannot require ', ext)
      }
    }
  })

  return this.all()
}

Importer.prototype.all = function () {
  var self = this
  return _.mapValues(this.imported, function (item) {
    return self.require(item)
  })
}

Importer.prototype.require = function (item) {
  return require(path.join(this.rootDir, item.from, item.name))
}

Importer.prototype.get = function (key) {
  return _.get(this.all(), key)
}

function dispatchImporter (rel__dirname) {
  return new Importer(rel__dirname)
}

module.exports = dispatchImporter
