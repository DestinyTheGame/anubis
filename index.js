'use strict';

var ignore = require('babel-ignore');
var fs = require('fs');

//
// Additional debug information.
//
// process.env.DEBUG = 'bungie-auth*,destiny*';
// require('diagnostics').to(fs.createWriteStream('/Users/V1/Projects/destinythegame/anubis/anubis.log'));
//

//
// Bootstrap the application with babel so we can write it in ES6.
//
require('babel-register')({ ignore: ignore });
require('./bootstrap.js');
