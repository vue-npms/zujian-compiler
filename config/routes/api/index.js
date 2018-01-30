var Router = require('koa-router')
let apiRouter = new Router({
    prefix: '/api'
})

require('./uploader')(apiRouter)

module.exports = function (app) {
    app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
}