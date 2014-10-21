(function(){
    'use strict';
    
    var http        = require('http'),
        path        = require('path'),
        express     = require('express'),
        mime        = require('mime'),
        utilIO      = require('util-io'),
        pipeIO      = require('pipe-io'),
        
        PORT        = 4321,
        OK          = 200,
        MOVED       = [301, 302],
        app         = express(),
        DIR         = path.normalize(__dirname + '/../'),
        DIR_IMG     = DIR + 'img/',
        EXT         = '.png',
        IMG_OK      = DIR_IMG + 'ok'    + EXT,
        IMG_ERROR   = DIR_IMG + 'error' + EXT,
        IMG_MOVED   = DIR_IMG + 'moved' + EXT,
        TYPE        = mime.lookup(IMG_OK),
        TWO_SECONDS = 2000;
    
    http.createServer(app).listen(PORT);
    
    console.log('server: ' + PORT + '\npid: ' + process.pid);
    
    app.use('/', express.static(DIR));
    
    app.get('/', function(req, res) {
        sendFile(res, 'README.md', console.log.bind(console));
    });
    
    app.get('/host/*', function(request, response) {
        var host = 'http://' + request.params[0],
            sended;
        
        console.log(request.params);
        
        if (host) {
            response.contentType(TYPE);
            
            setTimeout(function() {
                sended = true;
                sendFile(response, IMG_MOVED);
            }, TWO_SECONDS);
            
            http.get(host, function(res) {
                var status = res.statusCode;
                
                console.log(status);
                if (!sended)
                    if (status === OK)
                        sendFile(response, IMG_OK);
                    else if(status === MOVED[0] || status === MOVED[1])
                        sendFile(response, IMG_MOVED);
                    else
                        sendFile(response, IMG_ERROR);
                
                sended = true;
            }).on('error', function() {
                response.contentType(TYPE);
                sendFile(response, IMG_ERROR);
            });
        } else
            response.send('/:host');
    });
    
    function sendFile(res, name, callback) {
        pipeIO.create(name, res, function(error) {
            if (error)
                res.send(error, 404);
            else
                utilIO.exec(callback, name);
        });
    }
})();
