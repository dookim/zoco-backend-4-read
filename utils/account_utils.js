var crypto = require('crypto');

var AccountUtils = exports;


// @return aid
AccountUtils.extractAid = function(ctoken) {
  var sctoken = ctoken.split('-');
  var said = [];

  said = said.concat(sctoken.splice(5,1));
  said = said.concat(sctoken.splice(1,1));

  var token = sctoken.join('-');
  var aid = said.reverse().join('.');

  return aid;
}

AccountUtils.parseClientToken = function(ctoken) {
  var sctoken = ctoken.split('-');
  var said = [];

  said = said.concat(sctoken.splice(5,1));
  said = said.concat(sctoken.splice(1,1));

  var token = sctoken.join('-');
  var aid = said.reverse().join('.');

  var ret = {}
  ret['aid'] = aid;
  ret['token'] = token;
  console.log('parse client token result -- ');
  console.log(ret);

  return ret;
}

AccountUtils._getRandom = function(min, max) {
  var now = new Date();
  var seed = now.getMilliseconds();
  var random = Math.floor(Math.random(seed) * Number(max - min)) + 
    Number(min);
  return random;
};


AccountUtils.getRandomAid = function(digit) {
  var rid = crypto.randomBytes(digit).toString('hex');
  return rid;
}

// console.log(accountUtils.getRandomAid(4));

