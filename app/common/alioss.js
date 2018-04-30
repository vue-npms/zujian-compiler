const oss = require('ali-oss').Wrapper
const appConfig = require('../../config/application.json')
const compiler = require('./compiler')
const zipFolder = require('../../libs/zip-folder')
const fs = require('fs')
const path = require('path')

const store = oss(appConfig.ossConfig)


module.exports = {
    saveSrcComWithIndex (index) {
        return new Promise((resolve, reject) => {
            let comPath = compiler.indexPath(index)
            // index.[hash:7].zip
            let configJsonFilePath = path.posix.resolve(`${compiler.indexPath(index)}/src/config.json`)
            let configString = fs.readFileSync(configJsonFilePath, 'utf8')
            let config = JSON.parse(configString)

            let shortHash = `${config.px && config.px.shortHash}.${config.rem && config.rem.shortHash}`

            let zipFileName = `${index}.${shortHash}.zip`
            zipFolder.zip(`${comPath}/src`, `${path.posix.resolve(comPath, zipFileName)}`).then(() => {
                store.put(`code/src-cloud/${zipFileName}`, `${comPath}/${zipFileName}`).then(object => {
                    resolve({src: {
                        index,
                        config,
                        zip_file_name: zipFileName,
                        object
                    }})
                }).catch(err => {
                    reject(err)
                })
            }).catch((err) => {
                reject(err)
            })
        })
    },
    saveDistComWithIndex (index) {
        return new Promise((resolve, reject) => {
            let comPath = compiler.indexPath(index)
            let distPath = `${comPath}/dist`
            let dirPaths = fs.readdirSync(distPath)

            let filePromises = []

            dirPaths.forEach(dir => {
                let files = fs.readdirSync(path.resolve(distPath, dir))
                files.forEach((fileName) => {
                    // let filePath = dirPath + '/' + files[i]
                    let filePath = path.resolve(distPath, dir, fileName)
                    if (fs.statSync(filePath).isFile()) {
                        filePromises.push(new Promise(((resolve, reject) => {
                            store.put(`code/dist/${index}/${dir}/${fileName}`, `${filePath}`).then(object => {
                                resolve({unit: dir, object})
                            }).catch(err => {
                                reject(err)
                            })
                        })))
                    }
                })
            })

            Promise.all(filePromises).then(objects => {
                resolve({dist: {
                    index,
                    objects
                }})
            }).catch(err => {
                reject(err)
            })

        })
    },
    saveComWithIndex (index) {
        return new Promise((resolve, reject) => {
            if (!index) {
                reject(new Error('index must exist'))
            }
            Promise.all([this.saveSrcComWithIndex(index), this.saveDistComWithIndex(index)]).then(resultList => {
                resolve(resultList)
            }).catch(err => {
                reject(err)
            })
        })
    }
}