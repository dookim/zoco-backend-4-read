/**
 * Created by duhyeong1.kim on 2014-08-20.
 */
'use strict';
//var gk = require('../common');
var Sequelize = require('../node_modules/sequelize');
//이거 노드에서 가져와야 할듯(js 파일에서)
var sequelize = new Sequelize('zoco', 'root', '@stanly@urqa', {
    // host 지정
    host: "127.0.0.1",
    // port 지정
    port: 3306
})
var utf8 = require('utf8');

exports.login = function(req, res) {
    //console.log("exception Data");
    var email  = req.body.email;
    req.session.email = email;
    res.send("login ok");
}


exports.query_book = function(req, res) {
    //console.log("exception Data");
    var book_query = req.query.query;


    var offset = req.query.offset;
    if(book_query == null || offset == null) {
	res.send("please set book_query and offset");
	return;
    }
//u should do join
    sequelize.query('SELECT * FROM book WHERE MATCH (title,author) AGAINST ("'+book_query+'") limit 7 offset ' + offset + ";", null, { raw: true }).success(function(data){
	res.send(data);
    })

}

exports.query_image = function(req,res) {

    var isbn = req.query.isbn;
    if(isbn == null) {
	res.send("please set isbn");
	return;
    }

    sequelize.query("SELECT bookimage FROM bookimage WHERE isbn='"+isbn+"';", null, { raw: true }).success(function(data){
        res.send(data[0].bookimage);
    })



}

exports.test = function(req,res) {
    var email = req.session.email;
    res.send("email : " + email);

}
