'use strict';

var os = require('os');
var hostname = os.hostname();
console.log("hostname:"+ hostname);

if (hostname == 'A12038') {
  // This config is for lhs    
} else {
  // This config is for develop server
  var config = require('./develop.json');
}


module.exports = config;

	