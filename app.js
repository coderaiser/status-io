(function(){
    'use strict';
    
    var http        = require('http'),
        express     = require('express'),
        mime        = require('mime'),
        fs          = require('fs'),
        
        PORT        = 4321,
        dir         = './img/',
        app         = express(),
        SVG         = 'svg',
        DIR         = SVG + '/',
        EXT         = '.' + SVG,
        OK          = DIR + 'ok' + EXT,
        ERROR       = DIR + 'error' + EXT,
        MOVED       = DIR + 'moved' + EXT,
        TYPE        = mime.lookup(OK);
    
    http.createServer(app).listen(PORT);
    
    console.log('server: ' + PORT);
   
    app.get('/*', function(request, response) {
        var host = 'http://' + request.params[0];
        
        if (host)
            http.get(host, function(res) {
                //response.send(res.statusCode);
                console.log(res.statusCode);
                response.contentType(TYPE);
                
                switch(res.statusCode) {
                case 200:
                    send(response, OK);
                    break;
                case 301:
                    send(response, MOVED);
                    break;
                default:
                    send(response, ERROR);
                    break;
                }
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
