var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.listFarmerRequests = function(req,res){

	var msg_payload = { };

	mq_client.make_request('listFarmerRequests_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);	
			console.log("sent farmer");
		}  
	});
};

exports.listProductRequests = function(req,res){

	var msg_payload = { };

	mq_client.make_request('listProductRequests_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("sent farmer");
			res.send(results);						
		}  
	});
};

exports.listCustomerRequests = function(req,res){

	var msg_payload = { };

	mq_client.make_request('listCustomerRequests_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);		
			console.log("sent customers");
		}  
	});
};

exports.approveFarmer = function(req,res){
	var farmerId = req.param("farmerId");

	var msg_payload = { 
			"farmerId" : farmerId
	};

	mq_client.make_request('approveFarmer_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.approveProduct = function(req,res){
	var productId = req.param("productId");

	console.log("..................................");
	console.log("productId"+productId);
	var msg_payload = { 
			"productId" : productId
	};

	mq_client.make_request('approveProduct_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.approveCustomer = function(req,res){
	var customerId = req.param("customerId");

	var msg_payload = { 
			"customerId" : customerId
	};

	mq_client.make_request('approveCustomer_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.rejectFarmer = function(req,res){
	var farmerId = req.param("farmerId");

	console.log("'''''''''''''''''''''''''''''''''''''''''''''");
	console.log("farmerId " + farmerId);
	var msg_payload = { 
			"farmerId" : farmerId
	};

	mq_client.make_request('rejectFarmer_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.rejectProduct = function(req,res){
	var productId = req.param("productId");

	var msg_payload = { 
			"productId" : productId
	};

	mq_client.make_request('rejectProduct_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.rejectCustomer = function(req,res){
	var customerId = req.param("customerId");

	var msg_payload = { 
			"customerId" : customerId
	};

	mq_client.make_request('rejectCustomer_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.listAllCustomers = function(req,res){

	console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
	var msg_payload = { };

	mq_client.make_request('listAllCustomers_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};











exports.fetchCustomerDetails = function(req,res){

	var customerId = req.param("customerId");

	var msg_payload = { 
			"customerId" : customerId
	};

	mq_client.make_request('fetchCustomerDetails_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.fetchReviewsByCustomer = function(req,res){

	var customerId = req.param("customerId");

	var msg_payload = { 
			"customerId" : customerId
	};

	mq_client.make_request('fetchReviewsByCustomer_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.fetchStatisticsData = function(req,res){
	console.log("--------------------exports.fetchDeliveryDetails===============");
	var toDate = req.param("to");
	var fromDate = req.param("from");
	
	console.log("toDate " + toDate + " fromDate " + fromDate);
	
	var msg_payload = { 
			"toDate" : toDate,
			"fromDate" : fromDate
	};
	console.log(msg_payload);
	mq_client.make_request('fetchStatisticsData_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);		
			console.log(results);
		}  
	});
};

exports.fetchDeliveryDetails = function(req,res){
	console.log(exports.fetchDeliveryDetails);
	
	var area = req.param("area");

	var msg_payload = { 
			"area" : area
	};

	console.log(msg_payload);
	
	mq_client.make_request('fetchDeliveryDetails_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.fetchRidesDetails = function(req,res){
	var category = req.param("category");
	var searchString = req.param("searchString");
	
	var msg_payload = { 
			"category" : category,
			"searchString" : searchString
	};

	mq_client.make_request('fetchRidesDetails_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
		console.log(results);
			res.send(results);						
		}  
	});
};

exports.searchBillDetails = function(req,res){
	console.log("exports.searchBillDetails");
	
	var category = req.param("category");
	var searchString = req.param("searchString");
	
	var msg_payload = { 
			"category" : category,
			"searchString" : searchString
	};
	console.log(msg_payload);
	mq_client.make_request('searchBillDetails_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};