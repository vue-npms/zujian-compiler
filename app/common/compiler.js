let vueCompiler = require('../../libs/vue-compiler')
let fs = require('fs')
let path = require('path')
module.exports = {
    indexPath (index) {
        if (!index) throw new Error('index must exist')
        return `tmp/compiled-components/${index}`
    },
    compile (index) {
        return new Promise((resolve, reject) => {
            // 编译vue组件
            let configJsonFilePath = path.posix.resolve(`${this.indexPath(index)}/src/config.json`)
            let configString = fs.readFileSync(configJsonFilePath, 'utf8')
            let config = JSON.parse(configString)

            vueCompiler.compile(Object.assign({}, config, {index})).then(data => {
                fs.writeFileSync(configJsonFilePath, JSON.stringify(Object.assign(config, {shortHash: data.stats.shortHash}), null, 2))
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}