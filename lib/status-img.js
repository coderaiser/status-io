'use strict';

const path = require('path');
const mime = require('mime');
const files = require('files-io');

const status = require('taus');

const OK = 200;
const MOVED = [301, 302];
const DIR = path.normalize(__dirname + '/../');
const DIR_IMG = DIR + 'img/';
const EXT = '.png';
const IMG_OK = DIR_IMG + 'ok' + EXT;
const IMG_ERROR = DIR_IMG + 'error' + EXT;
const IMG_MOVED = DIR_IMG + 'moved' + EXT;
const TYPE = mime.getType(IMG_OK);

const TIME = 1000;

module.exports = (addr, res) => {
    let sended;
    
    setTimeout(() => {
        if (!sended) {
            sended = true;
            sendFile(res, IMG_MOVED);
        }
    }, TIME);
    
    status(addr, (error, status) => {
        if (sended)
            return;
        
        sended = true;
        res.contentType(TYPE);
        
        if (status === OK)
            return sendFile(res, IMG_OK);
        
        if (MOVED.includes(status))
            return sendFile(res, IMG_MOVED);
        
        sendFile(res, IMG_ERROR);
    });
};

function sendFile(res, name) {
    files.pipe(name, res).catch((error) => {
        res.send(error.message);
    });
}

