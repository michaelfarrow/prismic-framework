module.exports = function (req, res) {
  res.locals.bodyClass = 'index'
  res.render('index')
}
