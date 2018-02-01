let vueCompiler = require('../../libs/vue-compiler')
let fs = require('fs')
let path = require('path')
module.exports = {
    indexPath (index) {
        if (!index) throw new Error('index must exist')
        return `tmp/compiled-components/${index}`
    },
    compile (index) {
        return new Promise((resolve) => {
            // 编译vue组件
            let configString = fs.readFileSync(path.posix.resolve(`${this.indexPath(index)}/src/config.json`), 'utf8')
            let config = JSON.parse(configString)

            vueCompiler.compile(Object.assign(config, {index})).then(data => {
                resolve(data)
            })
        })
    }
}