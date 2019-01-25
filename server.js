#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    const filePath = request.url === '/' ? 'index.html' : request.url.replace(/^\//, '');
    if (fs.existsSync(filePath)) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(fs.readFileSync(filePath));
    } else {
        response.writeHead(404);
    }

    response.end();
});
server.listen(8080, function () {
    console.log((new Date()) + ' WebSocket Server is listening on port 8080');
    console.log((new Date()) + ' HTTP Client: http://localhost:8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(JSON.stringify({
                type: 'server_keep',
                count: JSON.parse(message.utf8Data).count
            }));
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});