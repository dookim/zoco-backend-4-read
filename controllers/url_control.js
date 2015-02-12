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



exports.query_book = function(req, res) {
    //console.log("exception Data");
    var book_query = req.query.query;

    sequelize.query('SELECT * FROM book WHERE MATCH (title,author) AGAINST ("'+book_query+'");', null, { raw: true }).success(function(data){
	res.send(data);
    })



}



