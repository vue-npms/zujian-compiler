module.exports = function joinedRoute (app) {
    if (!app) throw new Error('必须传入app参数')
    require('./api')(app)
}