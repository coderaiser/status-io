(function(){
    'use strict';
    
    var http        = require('http'),
        express     = require('express'),
        mime        = require('mime'),
        fs          = require('fs'),
        
        PORT        = 4321,
        dir         = './img/',
        app         = express(),
        OK          = 'ok.svg',
        ERROR       = 'error.svg',
        TYPE        = mime.lookup(OK);
    
    http.createServer(app).listen(PORT);
    
    console.log('server: ' + PORT);
    
    app.get('/', function(request, response) {
        var host = request.query.host;
        console.log(host);
        
        if (host)
            http.get(host, function(res) {
                //response.send(res.statusCode);
                console.log(res.statusCode);
                response.contentType(TYPE);
                if (res.statusCode === 200)
                    send(response, OK);
                else
                    send(response, ERROR);
            }).on('error', function(e) {
                //response.send(e);
                response.contentType(TYPE);
                send(response, ERROR);
            });
        else
            response.send('/:host');
    });
    
    function send(res, name, callback) {
        var read   = fs.createReadStream(name),
            error   = function (error) {
                res.send(error);
            },
            success = function () {
                if (typeof callback === 'function')
                    callback(name);
            };
        
        res.on('error', error);
        read.on('error', error);
        read.on('open', function() {
            read.pipe(res);
            read.on('end', success);
        });
    }
})();
