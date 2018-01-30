const Koa = require('koa')
const config = require("./config/application.json")
const app = new Koa()

require('./config/routes')(app)

app.listen(config.PORT);
console.log(`listen at port: ${config.PORT}`)


