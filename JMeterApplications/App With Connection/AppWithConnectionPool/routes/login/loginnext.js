var ejs = require('ejs');
var mysql = require('../mysql');
function loginnext(req, res) {

	var json_responses;
	var sqlQuery = "select id,password,fullname,email,phonenum,countrycode from users where (email = '"
			+ req.param("loginid")
			+ "') OR (username = '"
			+ "@"
			+ req.param("loginid") + "')";

	mysql.fetchData(function(err, result) {
		if (err) {
			json_responses = {
				"statusCode" : 401
			};
			res.send(json_responses);
			console.log('Error occured');
		} else {
			if (result.length > 0) {
				var compared = true;
				if(compared){
				    	req.session.userid = result[0].id;
						console.log("Session initialized");
						json_responses = {
							"statusCode" : 200,
							"userid" : result[0].id
						};
						res.send(json_responses);
				    }else {

						json_responses = {
							"statusCode" : 401
						};
						res.send(json_responses);
					}
			} else {

				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
			}
		}
	}, sqlQuery)

};

exports.loginnext = loginnext;