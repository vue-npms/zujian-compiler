'use strict'
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (assetsSubDirectory, _path) {
    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {sourceMap: false}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: true,
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        sourceMap: options.sourceMap
    }
  }
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader, postcssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass').concat(
      {
        loader: 'sass-resources-loader',
        // options: {
        //   resources: path.resolve(__dirname, '../src/assets/stylesheets/mixins/vmuiVar.scss')
        // }
        options: {
          resources: (function (scssConfig) {
            let resources = [
                path.resolve(__dirname, './common/scss/mixins/var.scss'),
                path.resolve(__dirname, './common/scss/mixins/animation.scss'),
                path.resolve(__dirname, './common/scss/mixins/classes.scss'),
                path.resolve(__dirname, './common/scss/mixins/devices.scss'),
            ]
            if (scssConfig) {
              if (scssConfig.resources) {
                  resources.concat(scssConfig.resources)
              }
              // default unit px
              if (scssConfig.unit === 'rem') {
                  resources.push(path.resolve(__dirname, './common/scss/mixins/rem.scss'))
              }
            }
            return resources
          })(options.scss)
        }
      }
    ),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
