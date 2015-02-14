'use strict';
var gk = require('./common');
process.env.TZ = 'Asia/Seoul';

// express
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
//var encryptHandler = require('./middleware/encrypt');

// app
var app = express();
app.locals.pretty = true;
app.use(bodyParser());
app.use(cookieParser());
app.use(compress());
app.use(session({secret: 'zoco'}));
	//app.use(encryptHandler());
	
// router
var router = require('./routes');
router.route(app);
app.listen(gk.config.port);
console.log("Server started at port " + gk.config.port);

