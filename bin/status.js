#!/usr/bin/env node

'use strict';

var http        = require('http'),
    express     = require('express'),
    files       = require('files-io'),
    
    DIR         = __dirname + '/../',
    
    status      = require('../lib/status-img'),
    
    PORT        = 4321,
    app         = express();

http.createServer(app).listen(PORT);

console.log('server: ' + PORT + '\npid: ' + process.pid);

app.use('/', express.static(DIR));
  
app.get('/', function(req, res) {
    sendFile(res, DIR + 'HELP.md');
});

app.get('/host(/*)?', function(request, response) {
    var addr    = request.params[1],
        host    = 'http://' + addr;
    
    if (!addr)
        response.send('/host/:address');
    else
        status(host, response);
});

function sendFile(res, name) {
    files.pipe(name, res, function(error) {
        if (error)
            res.send(error.message);
    });
}
