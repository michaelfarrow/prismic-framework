var _ = require('lodash')

module.exports = function (level, dom, element, content, context) {
  return dom.createElement(
    'h' + level,
    {},
    content
  )
}
