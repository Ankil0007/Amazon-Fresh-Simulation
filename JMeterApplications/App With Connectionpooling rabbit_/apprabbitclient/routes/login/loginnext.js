var ejs = require('ejs');
var mq_client = require('C:/Users/Nived BN/Desktop/JMeter/Applications/App With Connectionpooling rabbit_/apprabbitclient/rpc/client');
function loginnext(req, res) {
	
	var msg_payload = { "email": req.param("loginid"), "username": "@"+ req.param("loginid"),"loginpassword":req.param('loginpassword')};
	console.log("Heyyyyy")
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.statusCode == 401){
				json_responses = {
						"statusCode" : 401
					};
				console.log(results.statusCode);
					res.send(json_responses);
			}
			else {    
				req.session.userid = results.userid;
				//console.log("Session initialized");
				json_responses = {
					"statusCode" : 200,
					"userid" : results.userid
				};
				res.send(json_responses);
			}
		}  
	});
};

exports.loginnext = loginnext;