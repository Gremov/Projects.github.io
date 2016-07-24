
var http = require('http');
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        
        request.setEncoding("utf8");
        
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Received POST data chunk '"+
            postDataChunk + "'.");
        });

        request.addListener("end", function() {
            route(handle, pathname, response, postData);
        });

        // response.writeHead(200, {"Content-Type": "text/plain"});
        // var content = route(handle, pathname);
        // // response.write("Hello World friends!\n");
        // response.write(content);
        // response.end();
    }
    
    http.createServer(onRequest).listen(process.env.PORT);
    console.log("Server has started.");
}

exports.start = start;


// var http = require('http');

// var server = new http.Server(); // http.Server -> net.Server -> EventEmitter

// server.Listen(process.env.PORT);

// server.on('request', function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello world friends!\n');
// });


// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello world friends!\n');
// }).listen(process.env.PORT);