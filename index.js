'use strict';

var ignore = require('babel-ignore');

//
// Bootstrap the application with babel so we can write it in ES6.
//
require('babel-register')({ ignore: ignore });
require('./bootstrap.js');
