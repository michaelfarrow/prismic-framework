module.exports = function (dom, element, content) {
  return dom.createLink(element.data, {}, content)
}
