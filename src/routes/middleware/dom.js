var Context = require('lib/prismic/Context')
var dom = require('prismic-dom')
var _ = require('lodash')
var defaultHtmlSerializer = require('lib/prismic/serializer')
var defaultLinkResolver = require('lib/prismic/resolver')
var moment = require('moment-timezone')

var getLinkResolver = function (linkResolver) {
  return linkResolver || defaultLinkResolver
}

var getHtmlSerializer = function (htmlSerializer, context) {
  return htmlSerializer || function () {
      var args = [].slice.call(arguments)
      args.push(context)
      return defaultHtmlSerializer.apply(null, args)
  }
}

var newMethods = {
  RichText: {
    asHtml: function (f, context, structuredText, linkResolver, htmlSerializer) {
      return f(structuredText, getLinkResolver(linkResolver), getHtmlSerializer(htmlSerializer, context))
    },
    asText: function (f, context, structuredText) {
      var text = f(structuredText)
      return text ? text.trim() : ''
    }
  },
  Link: {
    url: function (f, context, link, linkResolver) {
      return f(link, getLinkResolver(linkResolver))
    }
  },
  Date: function (f, context, date) {
    if (!date) return null
    var isDate = date.length !== 24
    var date = f(date)
    var momentDate = moment(date).tz('Europe/London')
    if (isDate) {
      momentDate.subtract(momentDate.utcOffset(), 'minutes')
    }
    return momentDate
  }
}

var wrapFunctions = function (res, o, p) {
  p = p || []
  return _.mapValues(o, function (value, key) {
    var subP = _.concat([], p, [key])
    if (_.isFunction(value)) {
      var newMethod = _.get(newMethods, subP.join('.'))
      if (newMethod && _.isFunction(newMethod)) {
        return function () {
          var args = [].slice.call(arguments)
          args.unshift(res.locals.context)
          args.unshift(value)
          return newMethod.apply(null, args)
        }
      }
      return value
    }
    return wrapFunctions(res, value, subP)
  })
}

module.exports = function (req, res, next) {
  res.locals.context = new Context
  res.locals.dom = wrapFunctions(res, dom)
  var elementAsHtml = function (type, element, linkResolver, htmlSerializer) {
    element.type = type
    return res.locals.dom.RichText.asHtml([element], linkResolver, htmlSerializer)
  }
  res.locals.dom.Element = {
    asHtml: elementAsHtml,
    hyperlink: function (link, text) {
      text = text || ' '
      return elementAsHtml('paragraph', {
        text: text,
        noParagraph: true,
        spans: [{
          start: 0,
          end: text.length,
          type: 'hyperlink',
          data: link
        }]
      })
    },
    image: function (image) {
      return elementAsHtml('image', image)
    },
    embed: function (embed) {
      return elementAsHtml('embed', {
        oembed: embed
      })
    }
  }
  next()
}
