const fs = require('fs')
const path = require('path')
module.exports = function rmDir(dirPath, removeSelf = true, removeChildDir = true) {
    try {
        var files = fs.readdirSync(dirPath)
    } catch (e) {
        return
    }
    files.forEach((file) => {
        // let filePath = dirPath + '/' + files[i]
        let filePath = path.resolve(dirPath, file)
        if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath)
        }
        else {
            rmDir(filePath, removeChildDir, removeChildDir)
        }
    })
    if (removeSelf) {
        fs.rmdirSync(dirPath)
    }
}