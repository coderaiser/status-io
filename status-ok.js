(function(){
    'use strict';
    
    var http        = require('http'),
        express     = require('express'),
        mime        = require('mime'),
        utilIO      = require('util.io'),
        utilPipe    = require('util-pipe'),
        
        PORT        = 4321,
        OK          = 200,
        MOVED       = [301, 302],
        app         = express(),
        DIR         = __dirname + '/img/',
        EXT         = '.png',
        OK_IMG      = DIR + 'ok'    + EXT,
        ERROR_IMG   = DIR + 'error' + EXT,
        MOVED_IMG   = DIR + 'moved' + EXT,
        TYPE        = mime.lookup(OK_IMG),
        TWO_SECONDS = 2000;
    
    http.createServer(app).listen(PORT);
    
    console.log('server: ' + PORT + '\npid: ' + process.pid);
    
    app.use('/', express.static(__dirname));
    
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
                sendFile(response, MOVED_IMG);
            }, TWO_SECONDS);
            
            http.get(host, function(res) {
                var status = res.statusCode;
                
                console.log(status);
                if (!sended)
                    if (status === OK)
                        sendFile(response, OK_IMG);
                    else if(status === MOVED[0] || status === MOVED[1])
                        sendFile(response, MOVED_IMG);
                    else
                        sendFile(response, ERROR_IMG);
                
                sended = true;
            }).on('error', function() {
                response.contentType(TYPE);
                sendFile(response, ERROR_IMG);
            });
        } else
            response.send('/:host');
    });
    
    function sendFile(res, name, callback) {
        utilPipe.create({
            from    : name,
            write   : res,
            callback: function(error) {
                if (error)
                    res.send(error, 404);
                else
                    utilIO.exec(callback, name);
            }
        });
    }
})();
