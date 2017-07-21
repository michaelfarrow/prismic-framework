var webpack = require('webpack')

module.exports = {
  plugins: [
    require('postcss-import')({
      addDependencyTo: webpack
    }),
    require('precss'),
    require('postcss-assets')({
      basePath: 'public/',
      loadPaths: ['img/']
    }),
    require('postcss-color-mix'),
    require('postcss-color-function'),
    require('postcss-responsive-type'),
    require('postcss-responsive-images'),
    require('postcss-media-minmax'),
    require('lost'),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 5%', 'ie >= 8', 'Firefox > 2', 'Opera > 5']
    }),
    require('postcss-font-magician')({
      formats: 'woff2 woff eot ttf svg otf'
    // hosted: '../fonts/',
    // custom: {
    //   'FontFamily': {
    //     variants: {
    //       400: {
    //         normal: {
    //           url: {
    //             eot:   '../fonts/webfont.eot',
    //             svg:   '../fonts/webfont.svg',
    //             ttf:   '../fonts/webfont.ttf',
    //             woff:  '../fonts/webfont.woff',
    //             woff2: '../fonts/webfont.woff2',
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    }),
    require('postcss-cachebuster')({
      imagesPath: '/public',
      cssPath: '/public/css'
    })
  ]
}
