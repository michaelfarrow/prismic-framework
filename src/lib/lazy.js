var _ = require('lodash')
var html = require('lib/html')

var lazy = function (el, customize, url, attrs) {
  attrs = attrs || {}
  var jsAttrs = _.cloneDeep(attrs)
  var nojsAttrs = _.cloneDeep(attrs)
  if (!jsAttrs.class) jsAttrs.class = []
  if (!_.isArray(jsAttrs.class)) jsAttrs.class = [jsAttrs.class]
  if (!_.isArray(nojsAttrs.class)) nojsAttrs.class = [nojsAttrs.class]
  jsAttrs.class.push('b-lazy', 'jsonly')
  jsAttrs['data-src'] = url
  nojsAttrs.class.push('b-lazy-nojs')
  var newAttrs = {
    js: jsAttrs,
    nojs: nojsAttrs
  }
  if (customize && _.isFunction(customize)) {
    newAttrs = customize(newAttrs)
  }
  return [
    html.createElement(
      el,
      newAttrs.js,
      ''
    ),
    html.createElement(
      'noscript',
      {},
      html.createElement(
        el,
        newAttrs.nojs,
        ''
      )
    )
  ].join('')
}

var background = function (url, attrs) {
  return lazy('span', function (attrs) {
    if (!attrs.nojs.style) attrs.nojs.style = []
    if (!_.isArray(attrs.nojs.style)) attrs.nojs.style = [attrs.nojs.style]
    attrs.nojs.style.push('background-image:url(' + url + ')')
    attrs.nojs.style = attrs.nojs.style.join(';')
    return attrs
  }, url, attrs)
}

var iframe = function (url, attrs) {
  return lazy('iframe', function (attrs) {
    attrs.nojs.src = url
    return attrs
  }, url, attrs)
}

module.exports = {
  background: background,
  iframe: iframe
}
