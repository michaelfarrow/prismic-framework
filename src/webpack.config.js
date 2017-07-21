var _ = require('lodash')
var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var ManifestPlugin = require('webpack-manifest-plugin')

var isProduction = process.argv.indexOf('-p') >= 0

var config = {
  entry: {
    app: './public/js/app.js'
  },
  output: {
    path: path.join(__dirname, 'public', 'bundle'),
    filename: isProduction ? '[name]_[hash].js' : '[name].js',
    publicPath: '/bundle/'
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules',
      'public/css'
    ]
  },
  module: { rules: [] },
  plugins: [
    function () {
      this.plugin('done', function (stats) {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('-p') !== -1) {
          _.each(stats.compilation.errors, function (error) {
            console.log('\n' + error.message)
          })
          process.exit(1)
        }
      })
    },
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: isProduction ? '[name]_[hash].js' : '[name].js'
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  watchOptions: {
    poll: 1000
  },
  devServer: {
    proxy: {
      '*': {
        target: 'http://localhost:' + (process.env.PORT || 8080),
        secure: false
      }
    }
  }
}

if (isProduction) {
  config.module.rules = _.union(config.module.rules, [
    {
      test: /\.(p)?css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader?-url!postcss-loader'
      })
    }
  ])

  config.plugins = _.union(config.plugins, [
    new ExtractTextPlugin('[name]_[hash].css'),
    new ManifestPlugin({
      basePath: '/bundle/'
    })
  ])
} else {
  config.devtool = 'source-map'

  config.module.rules = _.union(config.module.rules, [
    {
      test: /\.(p)?css$/,
      loader: 'style-loader!css-loader?-url!postcss-loader'
    }
  ])

  config.plugins = _.union(config.plugins, [
    new webpack.WatchIgnorePlugin([path.join(__dirname, 'node_modules')])
  ])
}

module.exports = config

process.on('SIGINT', function () {
  console.log('got SIGINT, exiting')
  process.exit()
})
