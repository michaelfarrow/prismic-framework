module.exports = function (dom, element, content, context) {
  var heading = require('./heading')
  return heading(4, dom, element, content, context)
}
