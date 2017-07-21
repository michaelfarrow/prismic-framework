module.exports = function (dom, element, content) {
  if (element.noParagraph) return content
  return dom.createElement(
    dom.matchesLabel(element, 'quote') ? 'blockquote' : 'p',
    { class: dom.labelClasses(element) },
    content
  )
}
