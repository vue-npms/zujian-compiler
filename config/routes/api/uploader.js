module.exports = function (router) {
    router
        .get('/', (ctx, next) => {
            ctx.body = 'Hello World!'
        })
}