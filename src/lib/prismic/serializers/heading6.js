module.exports = function (dom, element, content, context) {
  var heading = require('./heading')
  return heading(6, dom, element, content, context)
}
