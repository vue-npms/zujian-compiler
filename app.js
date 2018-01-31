const config = require("./config/application.json")
var express = require('express')
const cors = require('cors')

var app = express()

app.use(cors())
require('./config/routes')(app)


app.listen(config.PORT, function () {
    console.log(`listen at port: ${config.PORT}`)
});
