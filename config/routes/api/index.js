module.exports = function (app) {
    app.use('/api/uploader', require('./uploader'))
}