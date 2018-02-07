const config = require("./config/application.json")
const Koa = require('koa')
const cors = require('koa2-cors')
var bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const app = new Koa()

app.use(logger())
app.use(cors())
app.use(bodyParser())

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        // console.log(err)
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
})

require('./config/routes')(app)

app.listen(config.PORT, function () {
    console.log(`listen at port: ${config.PORT}`)
});
