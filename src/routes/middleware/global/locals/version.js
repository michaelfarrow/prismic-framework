var dependencies = require('package.json').dependencies

module.exports = {
  express: dependencies.express,
  prismic: dependencies['prismic-javascript'],
  dom: dependencies['prismic-dom']
}
