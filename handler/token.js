'use strict';
var gk = require('../gk');
var async = require('async');
var util = require('../utils/account_utils');

var TokenHandler = exports;
var self = TokenHandler;
var ns   = gk.config.redis.namespace;

self.getTokenKey = function(aid) {
    return 'ns:token:' + aid;
};

exports.getUserKey = function() {
    return 'ns:user';
};

exports.accountCounterKey = function() {
  return ns + ':accounts:count';
};


TokenHandler.userRegister = function(info, callback) {
  gk.log.debug('userRegister', info);
  var user_aid;
  var new_token;

  async.series([
      function (cb) {
      self.createAid(info.kakaoid, function (err, aid) {
        gk.log.debug('aid: ', aid);
        user_aid = aid;
        cb();
      });
    },
    function (cb){
      gk.log.debug('#1 aid ->>> ', user_aid);
      self.setUser(user_aid, info.kakaoid,function(err) {
        gk.log.debug('aid->>>>', user_aid);
        cb(err);
      });
    },
    function (cb) {
      var token = self.createToken(user_aid);
      self.updateToken(user_aid, token, function (err) {
        if (err) { gk.log.error(err); return cb(err); }
        new_token = token
        gk.log.debug('#2 token is ->>> ' + token)
        cb();
      });
    }
  ], function (err) {
    if (err) { gk.log.error(err); }
    callback(err, new_token);
  });

};



// Create aid.
// @return {string} aid
TokenHandler.createAid = function(userid, callback) {
  var util = require('../utils/account_utils');
  self.getLowUsedStoreInstanceId(function(err, instanceId) {
    if (err) { gk.log.error('createAid:', err); }
    var aid = instanceId + '#' + util.getRandomAid(2) + '.' + util.getRandomAid(2);
    gk.log.debug('#### userid: ' +userid + ' created aid: ' + aid);
    callback(err, aid);
  });
};


self.initStoreData = function(callback) {
  gk.log.debug('initStoreData');
  var ns = gk.config.redis.namespace;
  //var redis = require('redis').createClient();
  var host = gk.config.redis.public.host;
  var port = gk.config.redis.public.port;
  
  console.log('host: ' + host + ', port: ' + port);
  var redis = require('redis').createClient(port, host);
  redis.on("error", function (err) {
        console.log("RedisError " + err);
  });

  var size = gk.config.sql.length - 1;
  gk.async.up(0, size, 1, function(i, next) {
    var instanceId = String(i + 1);
    var fakeAid = instanceId + '#';
    redis.keys('*:accounts:*', function (err, accounts) {
      var count = String(accounts.length);
      redis.zadd(self.accountCounterKey(), count, instanceId, function(err) {
        next();
      })
    });
  }, function() {
    gk.log.info('initStoreData: done');
    callback(null);
  });
};


// Get low used store instance id.
// @usedkey ns:accounts:count
self.getLowUsedStoreInstanceId = function(callback) {
  gk.log.debug('getLowUsedStoreInstanceId');
  //var redis = require('redis').createClient();
  var host = gk.config.redis.public.host;
  var port = gk.config.redis.public.port;
  
  var redis = require('redis').createClient(port, host);
  redis.on("error", function (err) {
        console.log("RedisError " + err);
  });

  async.series([
    // check total count
    function(cb) {
      var serverCount = gk.config.sql.length - 1;
      gk.log.debug('###data base count: ',serverCount);

      redis.exists(self.accountCounterKey(), function(err, exists) {
        if (exists == 1) {
          // check the number of instances active.
          // The variable serverCount must be larger or same as the one before.
          redis.zcard(self.accountCounterKey(), function(err, count) {
            if (err) { gk.log.error(err); }
            if (serverCount > count) {
              return self.initStoreData(cb);
            }
            return cb();
          });
        } else {
          return self.initStoreData(cb);
        }
      });
    },  
    // get low used store instance id
    // and increase count.
    function(cb) {
      var args = [self.accountCounterKey(), '-inf', '+inf', 'LIMIT', 0, 1];
      redis.zrangebyscore(args, function (err, id) {
        gk.log.debug('#1 getLowUsedStoreInstanceId: ', id);
        if (err) { gk.log.error('err', err); }
        redis.zincrby(self.accountCounterKey(), 1, id, function(err) {
          gk.log.debug('#2 getLowUsedStoreInstanceId: ', id);
          callback(err, id);
        });
      });
    }
  ], function(id, err) {
    gk.log.error(err, id);
    callback(err, id);
  });
};



TokenHandler.createToken = function(aid) {
  
  var uuid = require('node-uuid');

  var token = uuid.v4();
  var said = aid.split('.');
  var stoken = token.split('-');
  stoken.splice(4, 0, said[1]);
  stoken.splice(1, 0, said[0]);
  var ctoken = stoken.join('-');
  gk.log.debug('createdToken: ' + ctoken);
  return ctoken;
};



TokenHandler.compareToken = function(token, callback) {
  gk.log.debug('compareToken token is ' + token);
  var aid = gk.accountUtils.extractAid(token);  
  var err;

  self.getToken(aid, function(err, ret){  
    if (ret != token) { err = "Failed To Compare Token" } 
    gk.log.debug('#1 compareToken Get token is ' + ret);
    gk.log.debug('#2 compareToken Get token is ' + token);
    callback(err, aid);
  });
};



self.getToken = function(aid, callback) {
  gk.log.debug('Token is aid ',aid);
  var token = '';
  var key = self.getTokenKey(aid);
  //var redis = require('redis').createClient();

  var host = gk.config.redis.public.host;
  var port = gk.config.redis.public.port;
  
  var redis = require('redis').createClient(port, host);
  redis.on("error", function (err) {
        console.log("RedisError " + err);
  });  

  redis.hget(key, aid, function (err, token) {
      gk.log.debug('redis get Token ', token);
      callback(err, token);
  });
};


self.updateToken = function(aid, token ,callback) {
  var key = self.getTokenKey(aid);
  //var redis = require('redis').createClient();
  var host = gk.config.redis.public.host;
  var port = gk.config.redis.public.port;
  
  var redis = require('redis').createClient(port, host);
  redis.on("error", function (err) {
        console.log("RedisError " + err);
  });  
  gk.log.debug('::updateToken::',token);
  redis.hset(key, aid, token, callback);
};



self.setUser = function (aid, userid, callback) {
  gk.log.debug('setUser Check User id : ', userid);
  var key = self.getUserKey();
  //var redis = require('redis').createClient();

  var host = gk.config.redis.public.host;
  var port = gk.config.redis.public.port;
  
  var redis = require('redis').createClient(port, host);
  redis.on("error", function (err) {
        console.log("RedisError " + err);
  });  
  redis.hset(key, userid, aid, function (err) {
    if (err) { gk.log.error('Fail Save User'); return callback(err); }
    return callback(err);
  });  
};


self.getUserAid = function(userid, callback) {
  gk.log.debug('getUserAid User id : ', userid);
  var key = self.getUserKey();
  //var redis = require('redis').createClient();

  var host = gk.config.redis.public.host;
  var port = gk.config.redis.public.port;
  
  var redis = require('redis').createClient(port, host);
  redis.on("error", function (err) {
        console.log("RedisError " + err);
  });  

  redis.hget(key, userid, function (err, aid) {
    if (err) { gk.log.error('Fail Get User'); return callback(err); }
    return callback(err, aid);
  });

};


// check user id
self.checkExistsUserId = function (userid, callback) {
  gk.log.debug('Check User id : ', userid);
  var key = self.getUserKey();
  //var redis = require('redis').createClient();
  var host = gk.config.redis.public.host;
  var port = gk.config.redis.public.port;
  
  var redis = require('redis').createClient(port, host);
  redis.on("error", function (err) {
        console.log("RedisError " + err);
  });  

  redis.hexists(key, userid, function (err, reply){
      if (err) { gk.log.error('Fail Check Kakao UserId'); return callback(err); }
      if (reply == 0) {
          return callback(null, false);
      }
      callback(err, true);
  });
};

TokenHandler.aidParseInstanceIndex = function (aid) {
  var indexString = aid.split('#');
  var index = parseInt(indexString[0]);

  gk.log.debug('index ' + index);
  return index;

};

// check exists block key
self.userIsBlocked = function(user_id, callback) {
  var key = gk.config.redis.namespace + ':accounts:' + user_id + ':block';
  //var redis = require('redis').createClient();

  var host = gk.config.redis.public.host;
  var port = gk.config.redis.public.port;
  
  var redis = require('redis').createClient(port, host);
  redis.on("error", function (err) {
        console.log("RedisError " + err);
  });  

  var ts = gk.dateUtils.getUnixTimestamp();
  redis.exists(key, function(err, result) {
    if (err) { return callback(err); }
    if (result === 0) {
      return callback(null, false);
    }
    // check over 24 hour
    redis.get(key, function(err, lastUnregisterTime) {
      if (err) { return callback(err); }
      if (lastUnregisterTime < ts - (24 * 3600)) {
        // not blocekd
        return callback(null, false);
      } else {
        // is blocked
        return callback(null, true);
      }
    })
  });
};


