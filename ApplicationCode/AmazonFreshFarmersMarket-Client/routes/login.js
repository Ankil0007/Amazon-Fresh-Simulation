var bcrypt = require('bcrypt-nodejs');
var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.createAccount = function(req,res)
{
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var email = req.param("email");
	var password = req.param("password");
	var hashedPassword = bcrypt.hashSync(password);
	var category = req.param("category");

	var msg_payload = { 
			"email" : email,
			"category" : category
	};

	console.log("exports.createAccount");
	mq_client.make_request('createAccount_queue',msg_payload, function(err,results){

		if(err){
			throw err;
		}
		else 
		{
			console.log(results);
			if(results.statusCode == 200){
				req.session.email = email;
				req.session.firstName = firstName;
				req.session.lastName = lastName;
				req.session.password = hashedPassword;
				req.session.category = category;
			}
			res.send(results);						
		}  
	});
};

exports.saveAddress = function(req,res)
{
	console.log("exports.saveAddress ");
	var results = {};
	var streetAddress = req.param("streetAddress");
	var city = req.param("city");
	var state = req.param("state");
	var zipCode = req.param("zipCode");
	var phoneNumber = req.param("phoneNumber");
	var location = req.param("location");
	var location_lat = req.param("location_lat");
	var location_lng = req.param("location_lng");

	req.session.streetAddress = streetAddress;
	req.session.city = city;
	req.session.state = state;
	req.session.zipCode = zipCode;
	req.session.phoneNumber = phoneNumber;
	req.session.location = location;
	req.session.location_lat = location_lat;
	req.session.location_lng = location_lng;

	results = {
			"statusCode" : 200
	};
	res.send(results);
};

exports.saveCardDetails = function(req,res)
{
	console.log("???????????????????????exports.saveCardDetails ");
	var cardNumber = req.param("cardNumber");
	var cardHolderName = req.param("cardHolderName");
	var cardExpirationMonth = req.param("cardExpirationMonth");
	var cardExpirationYear = req.param("cardExpirationYear");

	var msg_payload = { 
			"email" : req.session.email,
			"firstName" : req.session.firstName,
			"lastName" : req.session.lastName,
			"password" : req.session.password,
			"category" : req.session.category,

			"streetAddress" : req.session.streetAddress,
			"city" : req.session.city,
			"state" : req.session.state,
			"zipCode" : req.session.zipCode,
			"phoneNumber" : req.session.phoneNumber,

			"location" : req.session.location,
			"location_lat" : req.session.location_lat,
			"location_lng" : req.session.location_lng,

			"cardNumber" : cardNumber,
			"cardHolderName" : cardHolderName,
			"cardExpirationMonth" : cardExpirationMonth,
			"cardExpirationYear" : cardExpirationYear,			
	};

	mq_client.make_request('saveCardDetails_queue',msg_payload, function(err,results){

		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});	
};

exports.saveFarmerDescription = function(req,res)
{
	console.log("exports.saveFarmerDescription ");
	var video = req.param("video");
	var image = req.param("image");
	var description = req.param("description");

	var msg_payload = { 
			"email" : req.session.email,
			"firstName" : req.session.firstName,
			"lastName" : req.session.lastName,
			"password" : req.session.password,
			"category" : req.session.category,

			"streetAddress" : req.session.streetAddress,
			"city" : req.session.city,
			"state" : req.session.state,
			"zipCode" : req.session.zipCode,
			"phoneNumber" : req.session.phoneNumber,

			"location" : req.session.location,
			"location_lat" : req.session.location_lat,
			"location_lng" : req.session.location_lng,

			"video" : video,
			"image" : image,
			"description" : description			
	};

	console.log(".........................");


	mq_client.make_request('saveFarmerDescription_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("######################################## Success Middleware");
			res.send(results);						
		}  
	});	
};

exports.afterLogin = function(req,res)
{
	console.log("---------------exports.afterLogin");
	var email = req.param("email");
	var password = req.param("password");
	var category = req.param("category");

	var msg_payload = { 
			"email" : email,
			"password" : password,
			"category" : category
	};

	mq_client.make_request('afterLogin_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log(category);
			console.log(results);
		
			if(results.results)
			{
				if(category == "farmer"){
					req.session.email = results.results[0].email;
					req.session.farmerId = results.results[0].farmer_id;
					req.session.firstname = results.results[0].firstname;
					req.session.lastname = results.results[0].lastname;
					req.session.category = category;
					res.send(results);	
				}
				else if(category == "customer"){
					req.session.email = results.results[0].email;
					req.session.customerId = results.results[0].customer_id;
					req.session.firstname = results.results[0].firstname;
					req.session.lastname = results.results[0].lastname;
					req.session.category = category;
					res.send(results);	
				}
			}else{

				res.send(results);
			}		
		}  
	});
}

exports.afterAdminLogin = function(req,res)
{
	var email = req.param("email");
	var password = req.param("password");

	var msg_payload = { 
			"email" : email,
			"password" : password
	};

	mq_client.make_request('adminLogin_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			
			res.send(results);						
		}  
	});
};

exports.deleteAccount = function(req,res)
{
	console.log("---------------------------exports.deleteAccount");
	var id = "";
	var category = req.param("category");

	if(category == "customer")
	{
		id = req.session.customerId;
	}
	else if(category == "farmer")
	{
		id = req.session.farmerId;
	}
	var msg_payload = { 
			"id" : id,
			"category" : category
	};

	mq_client.make_request('deleteAccount_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.logout = function(req,res)
{
	req.session.destroy();
	console.log(req.headers);
	res.clearCookie(req.headers.cookie, {path:'/'});
	json_response ={
			"statusCode" : 200,
			"statusMessage" : "User logged out"
	};
	res.send(json_response);		
};





