var Prismic = require('prismic-javascript')

module.exports = function (req, res, next) {
  // req.prismic.query(
  //   Prismic.Predicates.at('document.type', 'page'),
  //   {},
  //   function (err, pages) {
  //     if (err) return next(err)
  //     console.log(pages)
  //     next()
  //   })
  next()
}
