'use strict'
var url_control = require(__dirname + '/../controllers/url_control');
//var url_control_jsonp = require(__dirname + '/../controllers/url_control_jsonp');
//var url_control_enc = require(__dirname + '/../controllers/url_control_enc');

var routes = function(app) {
	// this is for legact rest apis for android
	app.get('/zoco/client/query_book/', url_control.query_book);
	app.get('/zoco/client/query_image/',url_control.query_image);
	// Encrypt Test
	//app.post('/test_enc', url_control_enc.url_test_enc );
}
exports.route = routes;
