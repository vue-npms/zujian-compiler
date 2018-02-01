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
        let destDir = `tmp/compiled-components/${index}/src`
        // empty or create folder
        utils.fsExt.rmDir(destDir, false, false)
        mkdirp(destDir, function (err) {
            if (err) throw err
            // copyfile
            Array.prototype.forEach.call(ctx.req.files, (file) => {
                fs.createReadStream(file.path).pipe(fs.createWriteStream(`${destDir}/${file.filename}`))
            })
        })
        ctx.body = 'post file success!'
    })
}