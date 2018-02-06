const compiler = require('../../../app/common/compiler')
const alioss = require('../../../app/common/alioss')
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

    apiRouter.post('/uploader/co_files',upload.array('files'), (ctx, next) => {
        // params
        let {index, units} = ctx.req.body
        let indexDir = `${compiler.indexPath(index)}`
        let srcDir = `${indexDir}/src`
        // empty or create folder
        utils.fsExt.rmDir(indexDir, false, false)

        return new Promise((resolve, reject) => {
            mkdirp(srcDir, function (err) {
                if (err) throw err
                // copyfile
                let filesCount = ctx.req.files.length
                Array.prototype.forEach.call(ctx.req.files, (file) => {
                    fs.createReadStream(file.path).pipe(fs.createWriteStream(`${srcDir}/${file.filename}`)).on('finish', () => {
                        filesCount--
                        if (!filesCount) {
                            // compiler component
                            compiler.compile(index, units).then(data => {
                                resolve(data)
                            }).catch(err => {
                                reject(err)
                            })
                        }
                    })
                })
            })
        }).then((data) => {
            ctx.body = data
        }).catch(err => {
            ctx.throw(400, err.message)
        })
    })

    apiRouter.post('/uploader/co_publish', (ctx, next) => {
        let {index} = ctx.request.body
        return alioss.saveComWithIndex(index).then(resultList => {
            ctx.body = Object.assign(resultList[0], resultList[1])
        }).catch(err => {
            ctx.throw(400, err.message)
        })
    })
}