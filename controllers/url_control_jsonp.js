/**
 * jsonp wrapper
 */
'use strict';

var Client = require('node-rest-client').Client;
var client = new Client();

/** wrapping **/
exports.jsonp_wrapper = function(req, res) {

	var uri = req.query.uri;	// 이 부분을 변경 해야 할듯 --> 형식을 바꿀필요가 있음
	var data = req.query.data;

	if( null == uri ){
		res.jsonp( {error:"Not enought argument"} );
		return;
	}

	var args = {
        data:data,
        headers:{"Content-Type": "application/json; charset=utf-8"}
    };

	client.post( uri, args, function(data, response){
        // parsed response body as js object
        // raw response
		res.header('Content-type','application/json');
		res.header('Charset','utf8');
        res.jsonp( data );
	});
}
