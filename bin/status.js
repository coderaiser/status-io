#!/usr/bin/env node

'use strict';

const http = require('http');
const express = require('express');
const files = require('files-io');

const status = require('../lib/status-img');

const DIR = __dirname + '/../';
const PORT = 4321;
const app = express();

http.createServer(app).listen(PORT);

console.log('server: ' + PORT + '\npid: ' + process.pid);

app.use('/', express.static(DIR));

app.get('/', (req, res) => {
    sendFile(res, DIR + 'HELP.md');
});

app.get('/host(/*)?', (request, response) => {
    const addr = request.params[1];
    const host = 'http://' + addr;
    
    if (!addr)
        return response.send('/host/:address');
    
    status(host, response);
});

function sendFile(res, name) {
    files.pipe(name, res, (error) => {
        if (error)
            res.send(error.message);
    });
}
