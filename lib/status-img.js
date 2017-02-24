'use strict';

var path = require('path');
var mime = require('mime');
var files = require('files-io');

var status = require('taus');

var OK = 200;
var MOVED = [301, 302];
var DIR = path.normalize(__dirname + '/../');
var DIR_IMG = DIR + 'img/';
var EXT = '.png';
var IMG_OK = DIR_IMG + 'ok'    + EXT;
var IMG_ERROR = DIR_IMG + 'error' + EXT;
var IMG_MOVED = DIR_IMG + 'moved' + EXT;
var TYPE = mime.lookup(IMG_OK);

var TIME = 1000;

module.exports = function(addr, res) {
    var sended;
    
    setTimeout(function() {
        if (!sended) {
            sended = true;
            sendFile(res, IMG_MOVED);
        }
    }, TIME);
    
    status(addr, function(error, status) {
        if (sended)
            return;
            
        sended = true;
        
        res.contentType(TYPE);
        
        if (status === OK)
            return sendFile(res, IMG_OK);
        
        if (status === MOVED[0] || status === MOVED[1])
            return sendFile(res, IMG_MOVED);
        
        sendFile(res, IMG_ERROR);
    });
};

function sendFile(res, name) {
    files.pipe(name, res, function(error) {
        if (error)
            res.send(error.message);
    });
}
