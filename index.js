'use strict';

var ignore = require('babel-ignore');
var app = require('electron').app;
var path = require('path');
var fs = require('fs');

//
// Additional debug information should be written to the application directory.
//
if (process.env.NODE_ENV !== 'development') {
  process.env.DEBUG = 'bungie-auth*,destiny*';
  require('diagnostics').to(fs.createWriteStream(path.join(app.getAppPath(), 'anubis.log')));
}

//
// Bootstrap the application with babel so we can write it in ES6.
//
require('babel-register')({ ignore: ignore });
require('./bootstrap.js');
