module.exports = function (req, res) {
  req.prismic.getByUID('page', req.params.uid, function (err, response) {
    if (err) return res.err(err)
    if (!response) return res.notfound()
    res.locals.page = response
    // return res.send('test')
    res.render('page')
  })
}
