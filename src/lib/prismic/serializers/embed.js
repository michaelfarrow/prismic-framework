var lazy = require('lib/lazy')

module.exports = function (dom, element, content) {
  var isVideo = element.oembed.type === 'video'
  var contentEls = []
  contentEls.push(lazy.iframe(element.oembed.html.match(/src="(.*?)"/)[1], {
    frameborder: '0',
    webkitallowfullscreen: '',
    mozallowfullscreen: '',
    allowfullscreen: ''
  }))
  if (isVideo && element.oembed.thumbnail_url) {
    contentEls.push(dom.createElement(
      'div',
      {
        class: 'content-embed-thumbnail',
        style: 'background-image: url(' + element.oembed.thumbnail_url + ')'
      },
      'Play'
    ))
  }
  return dom.createElement(
    'div',
    {
      class: dom.labelClasses(element, [
        'content-embed',
        'content-embed-type-' + element.oembed.type,
        'content-embed-provider-' + element.oembed.provider_name.toLowerCase()
      ])
    },
    dom.createElement(
      'div',
      {
        class: 'content-embed-inner',
        style: isVideo && element.oembed.width && element.oembed.height
          ? 'padding-top:' + (element.oembed.height / element.oembed.width * 100) + '%;'
          : ''
      },
      contentEls
    )
  )
}
