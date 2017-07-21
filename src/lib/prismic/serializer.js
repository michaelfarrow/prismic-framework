var _ = require('lodash')
var dom = require('prismic-dom')
var importer = require('lib/importer')(__dirname)
var html = require('lib/html')
importer.import('./serializers')
var linkResolver = require('./resolver')

var slug = require('slug')

var helpers = {}

helpers.labelClass = 'content-label'

helpers.formatLabel = function (l) {
  return helpers.labelClass + '-' + slug(l.toLowerCase())
}

helpers.getLabel = function (element) {
  var l = _.get(element, 'data.label')
  if (!l) l = _.get(element, 'label')
  if (l) l = helpers.formatLabel(l)
  return l
}

helpers.matchesLabel = function (element, l) {
  var elementL = helpers.getLabel(element)
  return elementL && elementL === helpers.formatLabel(l)
}

helpers.labelClasses = function (element, start) {
  var l = element
  if (_.isObject(element)) l = helpers.getLabel(element)
  start = start || []
  if (!_.isArray(start)) start = [start]
  l = l ? [l] : []
  if (l.length) l.unshift(helpers.labelClass)
  return _.concat(start, l).join(' ')
}

helpers.createElement = html.createElement

helpers.createLink = function (link, attrs, content) {
  if (!link) return content
  var url = dom.Link.url(link, linkResolver)
  if (!url) return content
  attrs = _.extend({}, attrs, {
    href: url || '',
    target: link.link_type === 'Web' ? '_blank' : ''
  })
  return helpers.createElement(
    'a',
    attrs,
    content
  )
}

module.exports = function (element, content, context) {
  var serializer = importer.get(element.type)
  if (serializer) return serializer(helpers, element, content, context)
  return null
}
