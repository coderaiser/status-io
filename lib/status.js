#!/usr/bin/env node

(function(){
    'use strict';
    
    var http        = require('http'),
        url         = require('url');
    
    module.exports = function(host, callback) {
        var options = url.parse(host);
        
        options.method = 'HEAD';
        
        http.request(options, function(res) {
            callback(null, res.statusCode);
        }).on('error', function(error) {
            callback(error);
        }).end();
    };
})();
