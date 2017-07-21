exports = module.exports = function (app) {
  // load error handlers
  app.use(function (req, res, next) {
    require('./middleware/error-handlers')(req, res, next)
  })

  // load middleware
  app.use(function (req, res, next) {
    require('./middleware')(req, res, next)
  })
  // load application routes
  app.use(function (req, res, next) {
    require('./app')(req, res, next)
  })

  app.use(function (req, res) {
    return res.notfound()
  })

  app.use(function (err, req, res, next) {
    if (!res.err) res.seconsole.log(err)
    return res.err(err)
  })
}
