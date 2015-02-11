'use strict'
var url_control = require(__dirname + '/../controllers/url_control');
var url_control_jsonp = require(__dirname + '/../controllers/url_control_jsonp');
var url_control_enc = require(__dirname + '/../controllers/url_control_enc');

var routes = function(app) {
	// this is for legact rest apis for android
	app.post('/urqa/client/connect', url_control.connect);
	app.post('/urqa/client/send/exception', url_control.receive_exception);
	app.post('/urqa/client/send/exception/native', url_control.receive_native);
	app.post('/test/',url_control.receive_test_data);
	app.get('/$',url_control.url_redirect);
	app.post('/urqa', url_control.url_redirect);

	// encrypt
	app.post('/urqa/client/get_key', url_control_enc.get_key );
	app.post('/urqa/client/req_enc', url_control_enc.req_enc );

	// jsonp
	app.get('/urqa/client/jsonp', url_control_jsonp.jsonp_wrapper );

	// Encrypt Test
	app.post('/test_enc', url_control_enc.url_test_enc );
}
exports.route = routes;
