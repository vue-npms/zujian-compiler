const utils = require('../../libs/utils')
const oss = require('ali-oss').Wrapper
const appConfig = require('../../config/application.json')
const compiler = require('./compiler')
const zipFolder = require('../../libs/zip-folder')
const path = require('path')

const store = oss(appConfig.ossConfig)


module.exports = {
    saveComWithIndex (index) {
        return new Promise((resolve, reject) => {
            let comPath = compiler.indexPath(index)
            // index.20180201225300.zip
            let zipFileName = `${index}.${utils.DateTime.now().toString('yyyyMMddHHmmss')}.zip`
            zipFolder.zip(`${comPath}/src`, `${path.posix.resolve(comPath, zipFileName)}`).then(() => {
                store.put(`oss-src-cloud/${zipFileName}`, `${comPath}/${zipFileName}`, (err, object) => {
                    if (err) {
                        reject(err)
                    }
                    resolve({zipFileName, object})
                }).catch(err => {
                    reject(err)
                })
            }).catch((err) => {
                reject(err)
            })
        })
    }
}