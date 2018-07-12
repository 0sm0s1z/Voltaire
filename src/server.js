var express = require('express');
var http = require('http');
var path = require('path');

var appServer = express();
appServer.use(express.static(path.join(__dirname, '')));

appServer.get('*', (req, res) => {
    res.sendFile(__dirname + '/../build/index.html');
});

http.createServer(appServer).listen(7000, function() {
    console.log('Express server listening on port');
});
