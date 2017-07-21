var lazy = require('lib/lazy')

module.exports = function (dom, element, content) {
  var hasCaption = dom.matchesLabel(element, 'image-alt-as-caption') && element.alt
  // var image = dom.createElement(
  //   'img',
  //   {
  //     src: element.url,
  //     alt: element.alt || '',
  //     copyright: element.copyright || ''
  //   }
  // )
  var image = lazy.background(
    element.url,
    {
      class: 'content-image-image',
      alt: element.alt || '',
      copyright: element.copyright || ''
    }
  )
  var inner = dom.createElement(
    'div',
    {
      class: 'content-image-inner',
      style: 'padding-top:' + (element.dimensions.height / element.dimensions.width * 100) + '%;'
    },
    image
  )
  return dom.createElement(
    'div',
    {
      class: dom.labelClasses(element, 'content-image'),
      style: dom.matchesLabel(element, 'image-full-width')
        ? ''
        : 'max-width:' + element.dimensions.width + 'px;'
    },
    [
      dom.createLink(element.linkTo, { class: 'content-image-link' }, inner),
      hasCaption
        ? dom.createElement(
          'span',
          { class: 'content-image-caption' },
          element.alt
        )
        : null
    ]
  )
}
