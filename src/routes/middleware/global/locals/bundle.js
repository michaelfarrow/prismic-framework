var manifest = process.env.NODE_ENV === 'production'
  ? require('public/bundle/manifest.json')
  : null

module.exports = function (path) {
  path = '/bundle/' + path
  return manifest && manifest[path] ? manifest[path] : path
}
