const fs = require('fs')
const Archiver = require('archiver')

module.exports = {
    zip (srcFolder, zipFilePath) {
        return new Promise((resolve) => {
            if (fs.existsSync(zipFilePath)) {
                return resolve()
            }

            let zipArchive = Archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            })

            let output = fs.createWriteStream(zipFilePath)

            output.on('close', function() {
                resolve()
            })

            zipArchive.on('error', (err) => {
                throw err
            })
            zipArchive.pipe(output)
            zipArchive.glob('**/*',{ cwd: srcFolder, src: ['**/*'], expand: true })
            // zipArchive.directory(srcFolder, false)
            zipArchive.finalize()
        })
    }
}