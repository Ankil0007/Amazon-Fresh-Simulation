var mysqlModule = require('mysql');
var mongo = require("./mongo");
var mysql = require("./mysql");
var mongoURL = "mongodb://localhost:27017/amazonFreshFarmersMarket";

var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

exports.handle_listFarmers_request = function(msg, callback) {

	//console.log("exports.handle_listFarmers_request ~~~~~~~~~~~");
	var json_response = {};
	var approved = 0;
	var query = "select * from amazonfresh.farmer";

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
					if(results.length <= 0)
					{
				
						json_response ={
								"statusCode" : 403,
								"statusMessage" : "No Farmers found"
						};
						callback(null, json_response);
					}
					else
					{
						
						json_response ={
								"statusCode" : 200,
								"results" : results,
								"statusMessage" : ""
						};
						
						callback(null, json_response);
					}		
				}
					
			}, query);
		};
	

exports.handle_amendFarmerDetails_request = function(msg, callback) {
	var farmerId = msg.farmerId;
	var firstName = msg.firstName;
	var lastName = msg.lastName;
	var address = msg.address;
	var city = msg.city;
	var state = msg.state;
	var zipCode = msg.zipCode;
	var phoneNumber = msg.phoneNumber;
	var image = msg.image;
	var video = msg.video;
	var description = msg.description;

	//console.log("exports.handle_amendFarmerDetails_request ~~~~~~~~~~~");
	var json_response = {};

	var query = "Update amazonfresh.farmer set firstname ='" + firstName
	+ "',lastname = '" + lastName + "',address = '" + address
	+ "',city = '" + city + "',state = '" + state + "',zip_code = '"
	+ zipCode + "',city = '" + city + "' where farmer_id ='" + farmerId
	+ "'";

	//console.log("Sql Query:" + query);

	mysql.fetchData(function(error, results) {
		////console.log(results);
		if (error) {
			json_response = {
					"statusCode" : 401,
					"statusMessage" : "Error occured while updating the product details"
			};
			callback(null, json_response);
		} else {
			 var redisKey = "select * from amazonfresh.farmer where approved=0";
				client.del(redisKey);
				
			if (results) {
				//console.log("Before mongo query");

				mongo.connect(mongoURL,function() {
					var coll = mongo.collection('farmer_details');

					coll.updateOne({
						farmer_id : parseInt(farmerId)
					},{
						$set : {
							"image" : image,
							"video" : video,
							"description" : description
						}
					},
					function(err,results) {
						if (err) {
							json_response = {
									"statusCode" : 401,
									"statusMessage" : "Unexpected error occured"
							};
							callback(null,json_response);
						} 
						else if (results) {
							////console.log(results);

							json_response = {
									"statusCode" : 200,
									"statusMessage" : ""
							};
							callback(null,json_response);
						} 
						else {
							json_response = {
									"statusCode" : 403,
									"statusMessage" : "Couldnot amend the details"
							};
							callback(null,json_response);
						}
					});
				});
			}
		}
	}, query);
};

exports.handle_searchFarmer_request = function(msg, callback) {
	var searchString = msg.searchString;
		
		//console.log("exports.handle_searchProduct_request ~~~~~~~~~~~");
		var json_response = {};

		var query = "SELECT * FROM amazonfresh.farmer where firstname like '%"+searchString+"%'";
		
		//console.log("Sql Query:"+query);
		
		mysql.fetchData(function(error, results) {
			////console.log(results);
			if(error)
			{
				json_response ={
						"statusCode" : 401,
						"statusMessage" : "Error occured while searching farmer details"
				};
			}
			else
			{	
				if(results)
					{
				
				json_response ={
						"statusCode" : 200,
						"results" : results,
						"statusMessage" : ""
				};
			}
				else
					
					{
						json_response = {
								"statusCode" : 403,
								"statusMessage" : "No Farmers found for searched name",
								"results" : results
						};
						callback(null, json_response);
					}
			}
				
			callback(null, json_response);
		}, query);

	};

exports.handle_fetchFarmerDetails_request = function(msg, callback) {
	console.log("handle_fetchFarmerDetails_request ---------------------------------");

	var farmerId = parseInt(msg.farmerId);

	var sqlResult = null;
	var json_response = {};

	var query = "select * from amazonfresh.farmer where farmer_id =" + farmerId + "";

	console.log("Sql Query:" + query);

	mysql.fetchData(function(error, results) {
		if (error) {
			//console.log("In error part");
			//console.log("In error part" + error);
			json_response = {
					"statusCode" : 401,
					"statusMessage" : "Unexpected error occured"
			};
			callback(null, json_response);
		} else {
			//console.log("Before mongo query");
			sqlResult = results;

			mongo.connect(mongoURL, function() {
				var coll = mongo.collection('farmer_details');
				//console.log("firing mongo query for farmer" + farmerId);
				coll.findOne({
					farmer_id : parseInt(farmerId)
				}, function(err, results) {
////console.log(results);
					if (err) {
						json_response = {
								"statusCode" : 401,
								"statusMessage" : "Unexpected error occured"
						};
						callback(null, json_response);
					} else if (results) {

						json_response = {
								"statusCode" : 200,
								"statusMessage" : "",
								"mongoResult" : results,
								"sqlResult" : sqlResult
						};
						callback(null, json_response);
					} else {
						////console.log(sqlResult);
						json_response = {
								"statusCode" : 403,
								"statusMessage" : "Couldnot Retrieve Data",
								"sqlResult" : sqlResult
						};
						callback(null, json_response);
					}

				});
			});
		}
	}, query);
};
