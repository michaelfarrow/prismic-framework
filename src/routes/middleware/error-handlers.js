var _ = require('lodash')
/**
Inits the error handler functions into `res`
*/
module.exports = function (req, res, next) {
  res.err = function () {
    this.locals.bodyClass = 'error error-500'

    var args = _.map(arguments)
    var e = args.shift()
    var t
    var m

    if (_.isError(e)) {
      t = e.message
    } else {
      if (_.isString(e)) t = e
      e = null
    }

    var s1 = args.shift()
    var s2 = args.shift()

    if (!_.isUndefined(s1) & !_.isUndefined(s2)) {
      t = s1
      m = s2
    } else if (!_.isUndefined(s1)) {
      m = s1
    }

    res.status(500).render('errors/500', {
      _: _,
      err: e,
      title: t,
      message: m
    })
  }
  res.notfound = function () {
    this.locals.bodyClass = 'error error-404'

    var args = _.map(arguments)

    var t
    var m
    var s1 = args.shift()
    var s2 = args.shift()

    if (!_.isUndefined(s1) & !_.isUndefined(s2)) {
      t = s1
      m = s2
    } else if (!_.isUndefined(s1)) {
      m = s1
    }

    res.status(404).render('errors/404', {
      _: _,
      url: req.url,
      title: t,
      message: m
    })
  }
  next()
}
