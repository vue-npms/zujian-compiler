var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const multer  = require('multer')
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
let upload = multer({ storage })

router.get('/upload', (ctx, next) => {
    ctx.body = 'Hello World!'
})

router.post('/multiple',upload.array('files'), (req, res) => {
    // params
    let {index} = req.body
    let destDir = `tmp/compiled-components/${index}/src`
    // create folder
    mkdirp(destDir, function (err) {
        if (err) throw err
        // copyfile
        Array.prototype.forEach.call(req.files, (file) => {
            fs.createReadStream(file.path).pipe(fs.createWriteStream(`${destDir}/${file.filename}`))
        })
    })
    res.send('post file success!')
})

module.exports = router