var http = require('http')
var vueCompiler = require('./vue-compiler')
http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'})
    vueCompiler.compile().then(function (result) {
        response.write(result)
        response.end()
    }, function (err) {
        response.write("err")
        response.end()
    })
}).listen(3333)
console.log("nodejs start listen 3333 port!")