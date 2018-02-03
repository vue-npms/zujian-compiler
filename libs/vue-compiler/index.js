const webpack = require("webpack");
const path = require('path');
module.exports = {
    compile (customConfig) {
        return new Promise(resolve => {
            let originConfig = Object.assign({}, customConfig)
            let comPath = `tmp/compiled-components/${customConfig.index}`
            let comSrcPath = `${comPath}/src`
            let comDistPath = `${comPath}/dist`

            let entry = {}
            if (customConfig.entry instanceof Array) {
                customConfig.entry.forEach(item => {
                    let fullPath = path.posix.resolve(comSrcPath, item)
                    let key = path.basename(fullPath, path.extname(fullPath))
                    entry[key] = fullPath
                })
            } else if (customConfig.entry instanceof Object) {
                Object.keys(customConfig.entry).forEach(key => {
                    let fullPath = path.posix.resolve(comSrcPath, customConfig.entry[key])
                    entry[key] = fullPath
                })
            }

            let usedCustomConfig = Object.assign(customConfig, {entry, comSrcPath, comDistPath, _comFullPath: path.posix.resolve(comPath)})
            const webpackConfig = require('./webpack.common.config').config(usedCustomConfig)
            const compiler = webpack(webpackConfig);
            compiler.run((err, stats) => {
                if (err) throw err
                resolve({config: usedCustomConfig, originConfig, stats: Object.assign(stats, {shortHash: stats.hash.slice(0, 7)})})
            });
        })
    }
}




// var compiler = require('vue-component-compiler')
// var path = require('path')
// var fs = require('fs')
// var filePath = path.resolve(__dirname, '../', 'src/button.vue')
// var fileContent = fs.readFileSync(filePath).toString()
// module.exports = {
//     compile () {
//         return new Promise((resolve, reject) => {
//             compiler.compile(fileContent, filePath, function (err, result) {
//                 // result is a common js module string
//                 if (err) {
//                     reject(err)
//                 }
//                 resolve(result)
//             })
//         })
//     }
// }