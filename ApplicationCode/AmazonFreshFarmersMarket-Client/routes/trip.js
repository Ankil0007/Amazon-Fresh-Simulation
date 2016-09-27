var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.createTrip = function(req,res){
	var billingId = req.param("billingId");

	var msg_payload = { 
			"billingId" : billingId
	};

	mq_client.make_request('createTrip_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.listTripsOfTruck = function(req,res){
	var truckId = req.param("truckId");

	var msg_payload = { 
			"truckId" : truckId
	};

	mq_client.make_request('listTripsOfTruck_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.listTripsOfDriver = function(req,res){
	var driverId = req.param("driverId");

	var msg_payload = { 
			"driverId" : driverId
	};

	mq_client.make_request('listTripsOfDriver_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};
