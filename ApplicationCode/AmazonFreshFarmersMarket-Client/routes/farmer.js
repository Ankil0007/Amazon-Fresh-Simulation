var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.listFarmers = function(req,res){

	var msg_payload = { };

	mq_client.make_request('listFarmers_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.amendFarmerDetails = function(req,res){
	var farmerId = req.session.farmerId;
	var firstName =req.param("firstName");
	var lastName =req.param("lastName");
	var address =req.param("address");
	var city =req.param("city");
	var state =req.param("state");
	var zipCode =req.param("zipCode");
	var phoneNumber =req.param("phoneNumber");
	var password =req.param("password");
	var image = req.param("image");
	var video = req.param("video");
	var description = req.param("description");




	var msg_payload = { 
			"farmerId" : farmerId,
			"firstName" : firstName,
			"lastName" : lastName,
			"address" : address,
			"city" : city,
			"state" : state,
			"zipCode" : zipCode,
			"phoneNumber" : phoneNumber,
			"password" : password,
			"image":image,
			"video":video,
			"description":description,
	};

	mq_client.make_request('amendFarmerDetails_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.searchFarmer = function(req,res){
	var searchString = req.param("searchString");

	var msg_payload = { 
			"searchString" : searchString
	};

	mq_client.make_request('searchFarmer_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.fetchFarmerDetails = function(req,res){
	var farmerId = null;
	if (req.session.farmerId) {
		 farmerId = req.session.farmerId;
	} else {
		 farmerId = req.param("farmerId");
	}

	var msg_payload = { 
			"farmerId" : farmerId
	};
	mq_client.make_request('fetchFarmerDetails_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			//console.log(results);
			res.send(results);						
		}  
	});
};
