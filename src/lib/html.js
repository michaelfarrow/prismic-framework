var _ = require('lodash')

var selfClosing = [
  'img'
]

var createElement = function (type, attrs, content) {
  attrs = _.map(attrs || {}, function (value, attr) {
    value = value || ''
    if (_.isArray(value)) value = value.join(' ')
    return attr + '="' + value + '"'
  })
  var html = ''
  html += '<' + type
  if (attrs.length) html += ' '
  html += attrs.join(' ')
  content = content || ''
  if (!_.isArray(content)) content = [content]
  content = _.filter(content, function (c) {
    return c !== null && c !== undefined
  })
  if (selfClosing.indexOf(type) !== -1) {
    html += '/>'
  } else {
    html += '>'
    html += content.join('')
    html += '</' + type + '>'
  }
  return html
}

module.exports = {
  createElement: createElement
}
