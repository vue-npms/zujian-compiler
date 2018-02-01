var Router = require('koa-router')
var apiRouter = new Router({
    prefix: '/api'
})

module.exports = function joinedRoute (app) {
    if (!app) throw new Error('必须传入app参数')
    require('./api')(apiRouter)
    app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
}