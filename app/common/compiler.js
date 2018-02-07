let vueCompiler = require('../../libs/vue-compiler')
let fs = require('fs')
let path = require('path')
module.exports = {
    indexPath (index) {
        if (!index) throw new Error('index must exist')
        return `tmp/compiled-components/${index}`
    },
    compile (index, units) {
        return new Promise((resolve, reject) => {
            // 编译vue组件
            let configJsonFilePath = path.posix.resolve(`${this.indexPath(index)}/src/config.json`)
            let configString = fs.readFileSync(configJsonFilePath, 'utf8')
            let config = JSON.parse(configString)

            config.units = units || config.units || ['px']

            let compilePromises = []
            config.units.forEach((unit) => {
                if (unit === 'px') {
                    compilePromises.push(vueCompiler.compile(Object.assign({}, config, {index, scss: {unit: 'px'}})))
                } else if (unit === 'rem') {
                    compilePromises.push(vueCompiler.compile(Object.assign({}, config, {index, scss: {unit: 'rem'}})))
                }
            })

            Promise.all(compilePromises).then(results => {
                let data = {}
                if (config.units.indexOf('px') !== -1) {
                    data.px = {
                        config: results[0].config,
                        originConfig: results[0].originConfig,
                        stats: {shortHash: results[0].stats.shortHash}
                    }
                    Object.assign(config, {
                        px: {
                            shortHash: results[0].stats.shortHash
                        }
                    })
                }
                if (config.units.indexOf('rem') !== -1) {
                    data.rem = {
                        config: results[1].config,
                        originConfig: results[1].originConfig,
                        stats: {shortHash: results[1].stats.shortHash}
                    }
                    Object.assign(config, {
                        rem: {
                            shortHash: results[1].stats.shortHash
                        }
                    })
                }

                fs.writeFileSync(configJsonFilePath, JSON.stringify(config, null, 2))

                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}