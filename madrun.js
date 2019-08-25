'use strict';

const {run} = require('madrun');

module.exports = {
    'start': () => 'bin/status.js',
    'lint': () => 'putout bin lib',
    'fix:lint': () => run('lint', '--fix'),
};

