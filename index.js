//
// Bootstrap the application with babel so we can write it in ES6.
//
require('babel-register')({
  ignore: function ignore(filename){
    var node_modules = !!~filename.indexOf('node_modules');

    if (~filename.indexOf('bungie-auth') && !~filename.indexOf('bungie-auth/node_modules')) {
      return false;
    }

    return node_modules;
  }
});

require('./bootstrap.js');
