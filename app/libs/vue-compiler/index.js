const webpack = require("webpack");
const path = require('path');
module.exports = {
    compile (customConfig) {
        return new Promise(resolve => {

            let comPath = `tmp/compiled-components/${customConfig.index}`
            let comSrcPath = `${comPath}/src`
            let comDistPath = `${comPath}/dist`

            let entry = {}
            Object.keys(customConfig.entry).forEach(key => {
                entry[key] = path.posix.resolve(comSrcPath, customConfig.entry[key])
            })

            let usedCustomConfig = Object.assign(customConfig, {entry, comSrcPath, comDistPath, _comFullPath: path.posix.resolve(comPath)})
            const webpackConfig = require('./webpack.common.config').config(usedCustomConfig)
            const compiler = webpack(webpackConfig);
            compiler.run((err, stats) => {
                if (err) throw err
                // ...
                // let resultData = stats.toString({
                //     colors: true,
                //     modules: false,
                //     children: false,
                //     chunks: false,
                //     chunkModules: false
                // }) + '\n\n'
                resolve(usedCustomConfig, stats)
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