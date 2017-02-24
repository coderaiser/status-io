#!/usr/bin/env node

'use strict';

var http = require('http');
var express = require('express');
var files = require('files-io');

var DIR = __dirname + '/../';

var status = require('../lib/status-img');

var PORT = 4321;
var app = express();

http.createServer(app).listen(PORT);

console.log('server: ' + PORT + '\npid: ' + process.pid);

app.use('/', express.static(DIR));

app.get('/', function(req, res) {
    sendFile(res, DIR + 'HELP.md');
});

app.get('/host(/*)?', function(request, response) {
    var addr = request.params[1];
    var host = 'http://' + addr;
    
    if (!addr)
        return response.send('/host/:address');
    
    status(host, response);
});

function sendFile(res, name) {
    files.pipe(name, res, function(error) {
        if (error)
            res.send(error.message);
    });
}
