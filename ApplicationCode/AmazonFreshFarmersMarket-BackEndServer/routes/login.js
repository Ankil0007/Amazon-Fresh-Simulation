var bcrypt = require('bcrypt-nodejs');
var mysqlModule = require('mysql');
var mongo = require("./mongo");
var mysql = require("./mysql");
var mongoURL = "mongodb://localhost:27017/amazonFreshFarmersMarket";

var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

exports.handle_afterLogin_request = function(msg, callback){
	console.log("-----exports.handle_afterLogin_request-----");
	
	var json_response = {};
	var email = msg.email;
	var password = msg.password;
	var category = msg.category;
	console.log(category);
	var query = '';
	if(category == "farmer"){
		query = "select * from amazonfresh.farmer where email='"+ email +"'";
	}else{
		query = "select * from amazonfresh.customer where email='"+ email +"'";
	}
	console.log(query);
	mysql.fetchData(function(error, results) {
		console.log(error);
		if(error)
		{
			json_response ={
					"statusCode" : 401,
					"results" : error.code
			};
			callback(null, json_response);
		}
		else
		{
			console.log(results);
			console.log(results.length);
			if(results.length > 0) {
				console.log(results[0].approved);
				if(results[0].approved == 0)
				{
					json_response ={
							"statusCode" : 403,
							"statusMessage" : "Approval pending",
							"results" : results
					};
					callback(null, json_response);
				} else if(results[0].approved == 2){
					json_response ={
							"statusCode" : 403,
							"statusMessage" : "Request rejected by administration",
							"results" : results
					};
					callback(null, json_response);
				} else if(results[0].approved == 3){
					json_response ={
							"statusCode" : 403,
							"statusMessage" : "Account deleted",
							"results" : results
					};
					callback(null, json_response);
				}			
				else {
					bcrypt.compare(password, results[0].password, function(err,correctPassword) {

						if(correctPassword){						
							json_response ={
									"statusCode" : 200,
									"statusMessage" : "",
									"results" : results
							};
							callback(null, json_response);
						}
						else{                      
							json_response ={
									"statusCode" : 403,
									"statusMessage" : "Invalid login credentials"
							};
							callback(null, json_response);                     
						}
					});
				
				}
			}else{                      
				json_response ={
						"statusCode" : 403,
						"statusMessage" : "No Details Found"
				};
				callback(null, json_response);                     
			}
		}
	}, query);
};

exports.handle_adminLogin_request = function(msg, callback){
	console.log("-----exports.handle_adminLogin_request-----");
	var json_response = {};
	var email = msg.email;
	var password = msg.password;

	var query = "select * from amazonfresh.administrator where email='"+ email +"'";
	console.log(query);
	mysql.fetchData(function(error, results) {
		if(error)
		{
			console.log(error);
			json_response ={
					"statusCode" : 401,
					"results" : error.code
			};
			callback(null, json_response);
		}
		else
		{		
			console.log(results);
			if(results.length <= 0)
			{
				json_response ={
						"statusCode" : 403,
						"statusMessage" : "Invalid email id"
				};
				callback(null, json_response);
			}
			else
			{
				bcrypt.compare(password, results[0].password, function(err,correctPassword) {

					console.log ("//////////////// " + correctPassword);
					console.log ("password " + password);
					console.log ("password " + results[0].password);

					if(correctPassword){						
						json_response ={
								"statusCode" : 200,
								"statusMessage" : "",
								"results" : results
						};
						callback(null, json_response);
					}
					else{                      
						json_response ={
								"statusCode" : 403,
								"statusMessage" : "Invalid login credentials"
						};
						callback(null, json_response);                     
					}
				});	
			}			
		}		
	}, query);
};

exports.handle_createAccount_request = function(msg, callback){
	console.log("-----exports.handle_createAccount_request-----");
	var json_response = {};
	var email = msg.email;
	var category = msg.category;
	var query = "";

	console.log(msg);
	if(category == "customer")
	{
		query = "select * from amazonfresh.customer where email='"+email+"'";
	}
	else 
	{
		query = "select * from amazonfresh.farmer where email='"+email+"'";
	}
	mysql.fetchData(function(error, results) {
		if(error)
		{
			console.log(error);
			json_response ={
					"statusCode" : 401,
					"results" : error.code
			};
			callback(null, json_response);
		}
		else
		{		
			console.log(results);
			console.log(results.length);
			if(results.length <= 0)
			{
				json_response ={
						"statusCode" : 200,
						"statusMessage" : "",
						"results" : results
				};
				callback(null, json_response);
			}
			else
			{
				json_response ={
						"statusCode" : 403,
						"statusMessage" : "Email already exist",
						"results" : results
				};
				callback(null, json_response);
			}			
		}		
	}, query);
};

exports.handle_saveCardDetails_request = function(msg, callback){
	console.log("-----exports.handle_saveCardDetails_request-----");
	var json_response = {};

	var email= msg.email;
	var firstName = msg.firstName;
	var lastName= msg.lastName;
	var password= msg.password;
	var category= msg.category;

	var streetAddress= msg.streetAddress;
	var city= msg.city;
	var state= msg.state;
	var zipCode= msg.zipCode;
	var phoneNumber= msg.phoneNumber;

	var cardNumber = msg.cardNumber;
	var cardHolderName = msg.cardHolderName;
	var cardExpirationMonth = msg.cardExpirationMonth;
	var cardExpirationYear = msg.cardExpirationYear;

	var location = msg.location;
	var location_lat = msg.location_lat;
	var location_lng = msg.location_lng;
	
	var approved = 0;

	var id = 0;

	console.log(msg);

	var query = "SELECT COALESCE(MAX(customer_id), 100000000) as max_id FROM   amazonfresh.customer";
	console.log(query);
	mysql.fetchData(function(error, results) {
		console.log(error);
		console.log(results);
		if(error)
		{
			json_response ={
					"statusCode" : 401,
					"results" : error.code
			};
			callback(null, json_response);
		}
		else
		{	
			if(results.length > 0)
			{
				id = parseInt(results[0].max_id) + 1;
			}
			console.log(id);
			var insertQuery = "insert into amazonfresh.customer (customer_id, firstname, lastname, address, city, " +
			"state, zip_code, phone_number, email, password,credit_card_no, card_holder_name, expiration_month, expiration_year, approved,dropoff_location_latitude,dropoff_location_longitude) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

			var inputParams = [id,firstName,lastName,streetAddress,city,state,zipCode,phoneNumber,email,password,cardNumber,cardHolderName,cardExpirationMonth,cardExpirationYear, approved,location_lat,location_lng];
			
			var insertQuery = mysqlModule.format(insertQuery, inputParams);
			console.log("		--------------			");
			console.log(insertQuery);
			mysql.fetchData(function(err,results){
				console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
				console.log(err);
				console.log(results);		

				if(err){
					console.log("//////////////////");
					console.log(err.code);
					json_response ={
							"statusCode" : 401,
							"statusMessage" : err.code
					};
					callback(null, json_response);
				}
				else 
				{
					var redisKey = "select * from amazonfresh.customer where approved=0";
					client.del(redisKey);
					json_response ={
							"statusCode" : 200,
							"statusMessage" : ""
					};
					callback(null, json_response);
				}  
			},insertQuery);
		}
	}, query);
};

exports.handle_saveFarmerDescription_request = function(msg, callback){
	var json_response = {};

	var email= msg.email;
	var firstName = msg.firstName;
	var lastName= msg.lastName;
	var password= msg.password;
	var category= msg.category;

	var streetAddress= msg.streetAddress;
	var city= msg.city;
	var state= msg.state;
	var zipCode= msg.zipCode;
	var phoneNumber= msg.phoneNumber;

	var image = msg.image;	
	var video = msg.video;	
	var description = msg.description;	
	var approved = 0;

	var location = msg.location;
	var location_lat = msg.location_lat;
	var location_lng = msg.location_lng;
	
	var id = 0;

	var query = "SELECT COALESCE(MAX(farmer_id), 100000000) as max_id FROM   amazonfresh.farmer";
	console.log(query);
	mysql.fetchData(function(error, results) {
		if(error)
		{
			json_response ={
					"statusCode" : 401,
					"results" : error.code
			};
			callback(null, json_response);
		}
		else
		{		
			if(results.length > 0)
			{
				id = parseInt(results[0].max_id) + 1;
			}

			var insertQuery = "insert into amazonfresh.farmer (farmer_id, firstname, lastname, address, city, " +
			"state, zip_code, phone_number, email, password, approved,pickup_location_latitude,pickup_location_longitude,pickup_location) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			
			var inputParams = [id,firstName,lastName,streetAddress,city,state,zipCode,phoneNumber,email,password, approved,location_lat,location_lng,location];

			var insertQuery = mysqlModule.format(insertQuery, inputParams);
			console.log(insertQuery);
			mysql.fetchData(function(err,results){	

				if(err){
					console.log("//////////////////");
					console.log(err.code);
					json_response ={
							"statusCode" : 401,
							"statusMessage" : err.code
					};
					callback(null, json_response);
				}
				else 
				{
					var redisKey = "select * from amazonfresh.farmer where approved=0";
					client.del(redisKey);

					mongo.connect(mongoURL, function(){
						var coll = mongo.collection('farmer_details');
						coll.insertOne({farmer_id: parseInt(id),image:image,video:video,description:description}, function(err, results){

							if (err) 
							{
								json_response ={
										"statusCode" : 401,
										"statusMessage" : "Unexpected error occured"
								};
								callback(null, json_response);
							} else {
								json_response ={
										"statusCode" : 200,
										"statusMessage" : ""
								};
								callback(null, json_response);
							}							
						});
					});
				}  
			},insertQuery);
		}
	}, query);
};

exports.handle_deleteAccount_request = function(msg, callback){
	var json_response = {};
	var id = msg.id;
	var category = msg.category;
	var approved = 3;

	var query = "";

	if(category == "farmer")
	{
		query = "update amazonfresh.farmer set approved="+ approved +" where farmer_id ='"+ id +"'";
	}
	else 
	{
		query = "update amazonfresh.customer set approved="+ approved +" where customer_id ='"+ id +"'";
	}

	console.log(query);

	mysql.fetchData(function(error, results) {
		if(error)
		{
			json_response ={
					"statusCode" : 401,
					"results" : error.code
			};
			callback(null, json_response);
		}
		else
		{	
			if(category == "farmer")
			{
				var redisKey = "select * from amazonfresh.farmer where approved=0";
				client.del(redisKey);
			}
			else if(category == "customer")
			{
				var redisKey = "select * from amazonfresh.farmer where approved=0";
				client.del(redisKey);
			}

			json_response ={
					"statusCode" : 200,
					"statusMessage" : ""
			};
			callback(null, json_response);			
		}		
	}, query);
};
