'use strict';

var cipher = require("../utils/cipher_utils")
var NodeRSA = require('node-rsa');

var enckey_manager = require( "../utils/enckey_manager");
var Client = require('node-rest-client').Client;

/**
 * request enc key
 */
exports.get_key = function(req, res){


	var p_key = req.body.public;

	enckey_manager.get_key( function( token, basekey ){

		//console.log( token, basekey );
		var return_data = { token:token, basekey:basekey };
		var key = new NodeRSA( p_key, {b: 1024} );
		var ret_data = key.encrypt( return_data , 'base64', 'utf8' );

		res.jsonp(  { 
						result : 'success',
					  	enc_data : ret_data
					} );

	});

};

/**
 * request Encrypt Data
 */
exports.req_enc = function( req, res ){

	var target_uri = req.body.target_uri;
	var token = req.body.token;
	var enc_data = req.body.enc_data;

	enckey_manager.get_key_use_token( token, function( iscontained, basekey ){

		if( null == token ){

			// token is null...
			var result = { 'result': 'fail', 'reson' : 'Token Create Fail' };
			res.status(406).send(result);

		}else{

			var decdata = cipher.decrypt( enc_data, basekey );

			var client = new Client();
			var args = {
		        data:decdata,
		        headers:{"Content-Type": "application/json; charset=utf-8"}
		    };

			client.post( req.protocol + '://' + req.get('host') + target_uri, args, function(data, response){
		        // parsed response body as js object
		        // raw response
				res.header('Content-type','application/json');
				res.header('Charset','utf8');
		        res.jsonp( data );
			});
		}

	});

};

/////////////////////////////////////////////////
// Encrypt Test function
exports.url_test_enc = function( req, res ){
    res.jsonp( req.body );
}