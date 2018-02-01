const config = require("./config/application.json")
const Koa = require('koa')
const cors = require('koa2-cors')
const app = new Koa()

app.use(cors())
require('./config/routes')(app)

app.on('error', (err) => {
    console.log(err)
})

app.listen(config.PORT, function () {
    console.log(`listen at port: ${config.PORT}`)
});
