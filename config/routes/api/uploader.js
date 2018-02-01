let compiler = require('../../../app/common/compiler')
const fs = require('fs')
const utils = require('../../../libs/utils')
const mkdirp = require('mkdirp')
const multer  = require('koa-multer')
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
let upload = multer({ storage })

module.exports = function (apiRouter) {

    apiRouter.get('/upload', (ctx, next) => {
        ctx.body = 'Hello World!'
    })

    apiRouter.post('/uploader/code_files',upload.array('files'), (ctx, next) => {
        // params
        let {index} = ctx.req.body
        let destDir = `${compiler.indexPath(index)}/src`
        // empty or create folder
        utils.fsExt.rmDir(destDir, false, false)

        return new Promise((resolve, reject) => {
            mkdirp(destDir, function (err) {
                if (err) throw err
                // copyfile
                let filesCount = ctx.req.files.length
                Array.prototype.forEach.call(ctx.req.files, (file) => {
                    fs.createReadStream(file.path).pipe(fs.createWriteStream(`${destDir}/${file.filename}`)).on('finish', () => {
                        filesCount--
                        if (!filesCount) {
                            // compiler component
                            compiler.compile(index).then(data => {
                                resolve(data)
                            }).catch(err => {
                                reject(err)
                            })
                        }
                    })
                })
            })
        }).then((data) => {
            ctx.body = 'compile finished!'
        })
    })
}