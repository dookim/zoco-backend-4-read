'use strict'

var commonUtils = exports;


commonUtils.createId = function() {
  var _uuid = require('node-uuid');
  var _hash = require('mhash').hash;
  var uuid = _uuid.v4();
  var createId = _hash('crc32b', uuid);
  return createId;
};

commonUtils._parseValue = function(data) {
  Object.keys(data).forEach(function(key) {
    data[key] = JSON.parse(data[key]);
  });
};

commonUtils._castToString = function(data) {
  if (data instanceof Array == true) {
    data.forEach(function(info) {
      Object.keys(info).forEach(function(key) {
        if (info[key] !== true && info[key] !== false) {
          if (typeof info[key] == 'number') {
            info[key] = String(info[key]);
          }
          if (info[key] == null){
            info[key] = "";
          }
        }
      });
    });
  } else {
    Object.keys(data).forEach(function(key) {
      if (data[key] !== true && data[key] !== false) {
        if (typeof data[key] == 'number') {
          data[key] = String(data[key]);
        }
        if (data[key] == null){
          data[key] = "";
        }        
      }
    });
  }
  return data;
};

//@param fields, data
//@param {Object} info(key, value)
commonUtils.parseFields = function(fields, data) {
  var result = {};
  var count = 0;
  for (var i in data) {
    var value = data[i];
    if (value == null) {
      value = "";
    }
    result[fields[i]] = value;
  }
  return result;
};

commonUtils.getRandom = function(min, max) {
  var now = new Date();
  var seed = now.getMilliseconds();
  var numMax = Number(max) + 1;
  var numMin = Number(min);
  var random = Math.floor(Math.random(seed) * Number(numMax - numMin)) + Number(numMin);
  return random;
};

commonUtils.getUnixTimestamp = function() {
  return String(Math.round((new Date()).getTime() / 1000)); 
};
