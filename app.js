'use strict';
var gk = require('./common');
process.env.TZ = 'Asia/Seoul';

// express
var express = require('express');
var encryptHandler = require('./middleware/encrypt');

// app
var app = express();
	app.configure(function() {
	app.locals.pretty = true;
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.compress());
	app.use(encryptHandler());
});
	
// router
var router = require('./routes');
router.route(app);
app.listen(gk.config.port);
console.log("Server started at port " + gk.config.port);

