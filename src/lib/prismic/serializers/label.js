module.exports = function (dom, element, content) {
  return dom.createElement(
    'span',
    { class: dom.labelClasses(element) },
    content
  )
}
