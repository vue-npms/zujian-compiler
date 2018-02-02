const fs = require('fs')
const path = require('path')
const zipArchive = require('archiver')('zip', {
    zlib: { level: 9 } // Sets the compression level.
})

module.exports = {
    zip (srcFolder, zipFilePath) {
        return new Promise((resolve) => {
            let output = fs.createWriteStream(zipFilePath)

            output.on('close', function() {
                resolve()
            })

            zipArchive.on('error', (err) => {
                throw err
            })
            zipArchive.pipe(output)
            zipArchive.glob('**/*',{ cwd: srcFolder, src: ['**/*'], expand: true })
            zipArchive.finalize()
        })
    }
}