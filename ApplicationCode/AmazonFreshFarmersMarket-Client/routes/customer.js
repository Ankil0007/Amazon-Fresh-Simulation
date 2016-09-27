var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.fetchDeliveryDetailsForCustomer = function(req,res){
	
	var customerId = req.session.customerId;
	var msg_payload = { 
			"customerId" : customerId
	};
	console.log(msg_payload);
	
	mq_client.make_request('fetchDeliveryDetailsForCustomer_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.listCustomers = function(req,res){

	var msg_payload = { };

	mq_client.make_request('listCustomers_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.postReview = function(req,res){
	var productID = req.param("productID");
	var review = req.param("review");
	var rating = req.param("rating");

	var msg_payload = { 
			"productID" : productID,
			"review" : review,
			"rating" : rating
	};

	mq_client.make_request('postReview_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

