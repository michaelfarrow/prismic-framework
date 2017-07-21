var Prismic = require('prismic-javascript')
var Cookies = require('cookies')
var linkResolver = require('lib/prismic/resolver')

module.exports = function (req, res) {
  var token = req.query.token
  if (token) {
    req.prismic.previewSession(token, linkResolver, '/')
      .then(function (url) {
        var cookies = new Cookies(req, res)
        cookies.set(Prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false })
        res.redirect(302, url)
      })
      .catch(function (err) {
        res.err(err.message)
      })
  } else {
    res.err('Missing token from querystring')
  }
}
