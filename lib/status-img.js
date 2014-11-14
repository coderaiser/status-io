(function() {
    'use strict';
    
    var path        = require('path'),
        mime        = require('mime'),
        files       = require('files-io'),
        
        status      = require('./status'),
        
        OK          = 200,
        MOVED       = [301, 302],
        DIR         = path.normalize(__dirname + '/../'),
        DIR_IMG     = DIR + 'img/',
        EXT         = '.png',
        IMG_OK      = DIR_IMG + 'ok'    + EXT,
        IMG_ERROR   = DIR_IMG + 'error' + EXT,
        IMG_MOVED   = DIR_IMG + 'moved' + EXT,
        TYPE        = mime.lookup(IMG_OK);
        
    module.exports = function(addr, res) {
        status(addr, function(error, status) {
            res.contentType(TYPE);
            
            if (status === OK)
                sendFile(res, IMG_OK);
            else if(status === MOVED[0] || status === MOVED[1])
                sendFile(res, IMG_MOVED);
            else
                sendFile(res, IMG_ERROR);
        });
    };
    
    function sendFile(res, name) {
        files.pipe(name, res, function(error) {
            if (error)
                res.send(error.message);
        });
    }
})();
