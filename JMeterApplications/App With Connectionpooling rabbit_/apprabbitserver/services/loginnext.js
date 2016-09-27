var pool = require('../pool')
var mysql = require('../mysql')

function handle_request(msg, callback){
	var res = {};
	var json_responses;
	
	var sqlQuery = "select id,password,fullname,email,phonenum,countrycode from users where (email = '"
			+ msg.email
			+ "') OR (username = '"
			+ "@"
			+ msg.username + "')";

	mysql.fetchData(function(err, result) {
		if (err) {
			json_responses = {
				"statusCode" : 401
			};
			console.log(err.message)
			callback(null, json_responses);
		} else {
			if (result.length > 0) {
				var compared =true;	
				    if(compared){
				    	
						console.log("Session initialized");
						json_responses = {
							"statusCode" : 200,
							"userid" : result[0].id
						};
						callback(null, json_responses);
						
				    }else {

						json_responses = {
							"statusCode" : 401
						};
						console.log("here")
						callback(null, json_responses);
						
					}

			} else {

				json_responses = {
					"statusCode" : 401
				};
				console.log("here in")
				callback(null, json_responses);
			}
		}
	}, sqlQuery)


}

exports.handle_request = handle_request;