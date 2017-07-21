module.exports = function (doc, ctx) {
  if (doc.type === 'page') {
    return '/' + doc.uid
  }
  return '/'
}
