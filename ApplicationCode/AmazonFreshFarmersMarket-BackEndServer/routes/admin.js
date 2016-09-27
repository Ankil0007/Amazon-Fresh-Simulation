var mysqlModule = require('mysql');
var mongo = require("./mongo");
var mysql = require("./mysql");
var mongoURL = "mongodb://localhost:27017/amazonFreshFarmersMarket";

var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

exports.handle_listFarmerRequests_request = function(msg, callback){
	console.log("exports.handle_listFarmerRequests_request ~~~~~~~~~~~");
	var json_response = {};
	var approved = 0;
	var query = "select * from amazonfresh.farmer where approved="+ approved +"";

	client.get( query , function(error,result){
		if(result)
		{
			console.log("found in redissssssssssssssssssssssss");
			callback(null, result);
		}
		else
		{

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
						console.log("not found in redissssssssssssssssssssssss");
						json_response ={
								"statusCode" : 403,
								"statusMessage" : "No pending requests"
						};
						client.set(query,JSON.stringify(json_response));
						callback(null, json_response);
					}
					else
					{
						console.log("not found in redis else");
						json_response ={
								"statusCode" : 200,
								"statusMessage" : "",
								"results" : results
						};
						client.set(query,JSON.stringify(json_response));
						callback(null, json_response);
					}			
				}		
			}, query);
		}
	});
};

exports.handle_listProductRequests_request = function(msg, callback){

	console.log("exports.handle_listProductRequests_request ~~~~~~~~~~~");
	var json_response = {};
	var approved = 0;
	var query = "select * from amazonfresh.products where approved="+ approved +"";

	client.get( query , function(error,result){
		if(result)
		{
			console.log("found in redissssssssssssssssssssssss");
			callback(null, result);
		}
		else
		{

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
						console.log("not found in redissssssssssssssssssssssss");
						json_response ={
								"statusCode" : 403,
								"statusMessage" : "No pending requests"
						};
						client.set(query,JSON.stringify(json_response));
						callback(null, json_response);
					}
					else
					{
						console.log("not found in redis else");
						json_response ={
								"statusCode" : 200,
								"statusMessage" : "",
								"results" : results
						};
						client.set(query,JSON.stringify(json_response));
						callback(null, json_response);
					}			
				}		
			}, query);
		}
	});
};

exports.handle_listCustomerRequests_request = function(msg, callback){

	console.log("exports.handle_listCustomerRequests_request ~~~~~~~~~~~");
	var json_response = {};
	var approved = 0;
	var query = "select * from amazonfresh.customer where approved="+ approved +"";

	client.get( query , function(error,result){
		if(result)
		{
			callback(null, result);
		}
		else
		{
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
						console.log("not found in redissssssssssssssssssssssss");
						json_response ={
								"statusCode" : 403,
								"statusMessage" : "No pending requests"
						};
						client.set(query,JSON.stringify(json_response));
						callback(null, json_response);
					}
					else
					{
						console.log("not found in redis else");
						json_response ={
								"statusCode" : 200,
								"statusMessage" : "",
								"results" : results
						};
						client.set(query,JSON.stringify(json_response));
						callback(null, json_response);
					}			
				}		
			}, query);
		}
	});
};

exports.handle_approveFarmer_request = function(msg, callback){
	console.log("exports.handle_approveFarmer_request ~~~~~~~~~~~");
	var json_response = {};
	var farmerId = msg.farmerId;
	var approved = 1;

	var query = "update amazonfresh.farmer set approved="+ approved +" where farmer_id ='"+ farmerId +"'";

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
			var redisKey = "select * from amazonfresh.farmer where approved=0";
			client.del(redisKey);	
			console.log("deleteddddddddddddd client.del(redisKey)");
			json_response ={
					"statusCode" : 200,
					"statusMessage" : ""
			};
			callback(null, json_response);
		}
	}, query);
};

exports.handle_approveProduct_request = function(msg, callback){
	console.log("exports.handle_approveProduct_request ~~~~~~~~~~~");

	var json_response = {};
	var productId = msg.productId;
	var approved = 1;

	var query = "update amazonfresh.products set approved="+ approved +" where product_id ='"+ productId +"'";

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
			var redisKey = "select * from amazonfresh.products where approved=0";
			client.del(redisKey);

			mongo.connect(mongoURL,function() {
				var coll = mongo.collection('product_details');

				coll.updateOne({
					product_id: parseInt(productId)
				},{
					$set : {
						"approved" : parseInt(approved)
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
						console.log(results);

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
	}, query);
};

exports.handle_approveCustomer_request = function(msg, callback){
	console.log("exports.handle_approveCustomer_request ~~~~~~~~~~~");

	var json_response = {};
	var customerId = msg.customerId;
	var approved = 1;

	var query = "update amazonfresh.customer set approved="+ approved +" where customer_id ='"+ customerId +"'";

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
			var redisKey = "select * from amazonfresh.customer where approved=0";
			client.del(redisKey);
			json_response ={
					"statusCode" : 200,
					"statusMessage" : "",
					"results" : results
			};
			callback(null, json_response);
		}
	}, query);
};

exports.handle_rejectFarmer_request = function(msg, callback){
	console.log("exports.handle_rejectFarmer_request ~~~~~~~~~~~");
	var json_response = {};
	var farmerId = msg.farmerId;
	var approved = 2;

	var query = "update amazonfresh.farmer set approved="+ approved +" where farmer_id ='"+ farmerId +"'";

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
			var redisKey = "select * from amazonfresh.farmer where approved=0";
			client.del(redisKey);
			json_response ={
					"statusCode" : 200,
					"statusMessage" : "",
			};
			callback(null, json_response);
		}
	}, query);
};

exports.handle_rejectProduct_request = function(msg, callback){
	console.log("exports.handle_rejectProduct_request ~~~~~~~~~~~");

	var json_response = {};
	var productId = msg.productId;
	var approved = 2;

	var query = "update amazonfresh.products set approved="+ approved +" where product_id ='"+ productId +"'";

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
			var redisKey = "select * from amazonfresh.products where approved=0";
			client.del(redisKey);
			mongo.connect(mongoURL,function() {
				var coll = mongo.collection('product_details');

				coll.updateOne({
					product_id: parseInt(productId)
				},{
					$set : {
						"approved" : parseInt(approved)
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
						console.log(results);

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
	}, query);
};

exports.handle_rejectCustomer_request = function(msg, callback){
	console.log("exports.handle_rejectCustomer_request ~~~~~~~~~~~");

	var json_response = {};
	var customerId = msg.customerId;
	var approved = 2;

	var query = "update amazonfresh.customer set approved="+ approved +" where customer_id ='"+ customerId +"'";

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
			var redisKey = "select * from amazonfresh.customer where approved=0";
			client.del(redisKey);
			json_response ={
					"statusCode" : 200,
					"statusMessage" : "",
					"results" : results
			};
			callback(null, json_response);
		}
	}, query);
};

exports.handle_viewCustomerAccount_request = function(msg, callback){
	console.log("exports.handle_viewCustomerAccount_request ~~~~~~~~~~~");
	var json_response = {};
	var searchString = msg.searchString;

	 var query="select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price,"+
	 "billing.status, billing.quantity, customer.customer_id, customer.firstname as customer_firstname, "+
	 "customer.lastname as customer_lastname, customer.address as customer_address, customer.city as customer_city, "+
	 "customer.state as customer_state, customer.zip_code as customer_zip_code,  "+
	 "customer.phone_number as customer_phone_number, customer.email as customer_email, "+
	 "products.product_id, products.product_name, billing.price*billing.quantity as price, billing.price as product_price, "+
	 "farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname, "+
	 "farmer.pickup_location, billing.dropoff_location, billing.driver_id, "+
	 "driver.firstname as driver_firstname, driver.lastname as driver_lastname, driver.truck_id, "+
	 "driver.truck_registration_number,billing.current_latitude,billing.current_longitude from "+
	 "amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer farmer,"+
	 "amazonfresh.products products, amazonfresh.driver driver "+
	 "where billing.customer_id='" + customerId + "' and customer.customer_id=billing.customer_id and "+
	 "products.product_id=billing.product_id and farmer.farmer_id=billing.farmer_id and billing.driver_id=driver.driver_id";
	
	 console.log(query);
	/*var query = "select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price," + 
	" billing.status, orders.order_id, billing_items.price, billing_items.quantity," + 
	" customer.customer_id, customer.firstname as customer_firstname, customer.lastname as customer_lastname," + 
	" customer.address as customer_address, customer.city as customer_city, customer.state as customer_state," + 
	" customer.zip_code as customer_zip_code,  customer.phone_number as customer_phone_number," +
	" customer.email as customer_email, products.product_id, products.product_name, products.product_price," + 
	" products.product_price, farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname," +
	" trips.trip_id, trips.pickup_location, trips.dropoff_location," +
	" driver.driver_id, driver.firstname as driver_firstname, driver.lastname as driver_lastname," +
	" trucks.truck_id, trucks.truck_registration_number" +
	" from amazonfresh.billing billing, amazonfresh.trips trips," +
	" amazonfresh.billing_items billing_items, amazonfresh.customer customer," +
	" amazonfresh.farmer farmer,amazonfresh.products products, amazonfresh.orders orders," +
	" amazonfresh.trucks trucks, amazonfresh.driver driver" +
	" where orders.customer_id = customer.customer_id and billing.order_id = orders.order_id and" +
	"  billing.billing_id = billing_items.billing_id and billing_items.product_id = products.product_id and" + 
	" products.farmer_id = farmer.farmer_id and trips.billing_id = billing.billing_id" + 
	" and trips.truck_id = trucks.truck_id and driver.driver_id = trips.driver_id" +
	" and billing.status like '%delivered%' and trips.dropoff_location like '%" + searchString + "%'";*/

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
						"statusMessage" : "No customer matches the search criteria"
				};
				callback(null, json_response);
			}
			else
			{
				json_response ={
						"statusCode" : 200,
						"statusMessage" : "",
						"results" : results
				};
				callback(null, json_response);
			}
		}
	}, query);
};

exports.handle_fetchStatisticsData_request = function(msg, callback){

	console.log("exports.handle_fetchStatisticsData_request ~~~~~~~~~~~");
	var json_response = {};

	var toDate = msg.toDate;
	var fromDate = msg.fromDate;

	var partsOfToDate = toDate.split('/');
	var partsOfFromDate = fromDate.split('/');
	
	var toDateToQuery = partsOfToDate[2]+'-'+partsOfToDate[0]+'-'+partsOfToDate[1];
	var fromDateToQuery = partsOfFromDate[2]+'-'+partsOfFromDate[0]+'-'+partsOfFromDate[1];
	
	
	var query = "select SUM(total_price) as 'revenue',billing_date" +
	" from amazonfresh.billing" +
	" where billing_date between '" + toDateToQuery +"' and '" + fromDateToQuery +"'" +
	" group by billing_date";

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
			if(results.length <= 0)
			{
				json_response ={
						"statusCode" : 403,
						"statusMessage" : "No data matches the search criteria"
				};
				callback(null, json_response);
			}
			else
			{
				console.log(results);
				resultsArray = [];

				resultsArray.push(['Date','Revenue']);

				results.forEach(function(result){
					var thedate = new Date(Date.parse(result.billing_date));
					resultsArray.push([result.billing_date,result.revenue]);
				});

				json_response ={
						"statusCode" : 200,
						"statusMessage" : "",
						"results" : resultsArray
				};
				callback(null, json_response);
			}
		}
	}, query);
};

exports.handle_fetchDeliveryDetails_request = function(msg, callback){
	console.log("exports.handle_fetchDeliveryDetails_request ~~~~~~~~~~~");
	var json_response = {};
	var area = msg.area;

	var query="select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price,"+
	 "billing.status, billing.quantity, customer.customer_id, customer.firstname as customer_firstname, "+
	 "customer.lastname as customer_lastname, customer.address as customer_address, customer.city as customer_city, "+
	 "customer.state as customer_state, customer.zip_code as customer_zip_code,  "+
	 "customer.phone_number as customer_phone_number, customer.email as customer_email, "+
	 "products.product_id, products.product_name, billing.price*billing.quantity as price, billing.price as product_price, "+
	 "farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname, "+
	 "farmer.pickup_location, billing.dropoff_location, billing.driver_id, "+
	 "driver.firstname as driver_firstname, driver.lastname as driver_lastname, driver.truck_id, "+
	 "driver.truck_registration_number,billing.current_latitude,billing.current_longitude from "+
	 "amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer farmer,"+
	 "amazonfresh.products products, amazonfresh.driver driver "+
	 "where billing.dropoff_location like '%" + area + "%' and customer.customer_id=billing.customer_id and "+
	 "products.product_id=billing.product_id and farmer.farmer_id=billing.farmer_id and billing.driver_id=driver.driver_id";
	

	
/*	var query = "select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price," + 
	" billing.status, orders.order_id, billing_items.price, billing_items.quantity," + 
	" customer.customer_id, customer.firstname as customer_firstname, customer.lastname as customer_lastname," + 
	" customer.address as customer_address, customer.city as customer_city, customer.state as customer_state," + 
	" customer.zip_code as customer_zip_code,  customer.phone_number as customer_phone_number," +
	" customer.email as customer_email, products.product_id, products.product_name, products.product_price," + 
	" products.product_price, farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname," +
	" trips.trip_id, trips.pickup_location, trips.dropoff_location," +
	" driver.driver_id, driver.firstname as driver_firstname, driver.lastname as driver_lastname," +
	" trucks.truck_id, trucks.truck_registration_number" +
	" from amazonfresh.billing billing, amazonfresh.trips trips," +
	" amazonfresh.billing_items billing_items, amazonfresh.customer customer," +
	" amazonfresh.farmer farmer,amazonfresh.products products, amazonfresh.orders orders," +
	" amazonfresh.trucks trucks, amazonfresh.driver driver" +
	" where orders.customer_id = customer.customer_id and billing.order_id = orders.order_id and" +
	"  billing.billing_id = billing_items.billing_id and billing_items.product_id = products.product_id and" + 
	" products.farmer_id = farmer.farmer_id and trips.billing_id = billing.billing_id" + 
	" and trips.truck_id = trucks.truck_id and driver.driver_id = trips.driver_id" +
	" and billing.status like '%delivered%' and trips.dropoff_location like '%" + area + "%'";*/

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
			if(results.length <= 0)
			{
				json_response ={
						"statusCode" : 403,
						"statusMessage" : "No bills matches the search criteria"
				};
				callback(null, json_response);
			}
			else
			{
				json_response ={
						"statusCode" : 200,
						"statusMessage" : "",
						"results" : results
				};
				callback(null, json_response);
			}
		}
	}, query);
};

exports.handle_fetchRidesDetails_request = function(msg, callback){
	//done
	console.log("exports.handle_fetchRidesDetails_request ~~~~~~~~~~~");
	var json_response = {};
	var category = msg.category;
	var searchString = msg.searchString;

	var query = "";
console.log(category);
	if(category == "area")
	{
		query = "select pickup_location_latitude,pickup_location_longitude,dropoff_location_latitude,dropoff_location_longitude from amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer where billing.customer_id = customer.customer_id and billing.farmer_id = farmer.farmer_id and billing.dropoff_location like '%" + searchString + "%'";
	}
	else if(category == "driver")
	{
		query = "select pickup_location_latitude,pickup_location_longitude,dropoff_location_latitude,dropoff_location_longitude from amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer where billing.customer_id = customer.customer_id and billing.farmer_id = farmer.farmer_id and billing.driver_id = '" + searchString + "'";
	}
	else if(category == "customer")
	{
		query = "select pickup_location_latitude,pickup_location_longitude,dropoff_location_latitude,dropoff_location_longitude from amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer where billing.customer_id = customer.customer_id and billing.farmer_id = farmer.farmer_id and customer.customer_id = '" + searchString + "'";
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
			if(results.length <= 0)
			{
				json_response ={
						"statusCode" : 403,
						"statusMessage" : "No rides to display"
				};
				callback(null, json_response);
			}
			else
			{
				json_response ={
						"statusCode" : 200,
						"statusMessage" : "",
						"results" : results
				};
				callback(null, json_response);
			}
		}
	}, query);
};


exports.handle_listAllCustomers_request = function(msg, callback){
	var json_response = {};

	var query = "select * from amazonfresh.customer";
console.log("query" + query);
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
			if(results)
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
						"statusMessage" : "No customers to display"
				};
				callback(null, json_response);
			}
		}
	}, query);
};

exports.handle_fetchCustomerDetails_request = function(msg, callback){
	console.log("exports.handle_fetchCustomerDetails_request ~~~~~~~~~~~");
	var json_response = {};
	var customerId = msg.customerId;
console.log("***********************"+customerId)

var query="select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price,"+
	 "billing.status, billing.quantity, customer.customer_id, customer.firstname as customer_firstname, "+
	 "customer.lastname as customer_lastname, customer.address as customer_address, customer.city as customer_city, "+
	 "customer.state as customer_state, customer.zip_code as customer_zip_code,  "+
	 "customer.phone_number as customer_phone_number, customer.email as customer_email, "+
	 "products.product_id, products.product_name, billing.price*billing.quantity as price, billing.price as product_price, "+
	 "farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname, "+
	 "farmer.pickup_location, billing.dropoff_location, billing.driver_id, "+
	 "driver.firstname as driver_firstname, driver.lastname as driver_lastname, driver.truck_id, "+
	 "driver.truck_registration_number,billing.current_latitude,billing.current_longitude from "+
	 "amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer farmer,"+
	 "amazonfresh.products products, amazonfresh.driver driver "+
	 "where billing.customer_id='" + customerId + "' and customer.customer_id=billing.customer_id and "+
	 "products.product_id=billing.product_id and farmer.farmer_id=billing.farmer_id and billing.driver_id=driver.driver_id";
	

	/*var query = "select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price," +
	" billing.status, orders.order_id, billing_items.price, billing_items.quantity," +
	" customer.customer_id, customer.firstname as customer_firstname, customer.lastname as customer_lastname," +
	" customer.address as customer_address, customer.city as customer_city, customer.state as customer_state," +
	" customer.zip_code as customer_zip_code,  customer.phone_number as customer_phone_number," +
	" customer.email as customer_email, products.product_id, products.product_name, products.product_price," +
	" products.product_price, farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname" +
	" from amazonfresh.billing billing," +
	" amazonfresh.billing_items billing_items, amazonfresh.customer customer," +
	" amazonfresh.farmer farmer,amazonfresh.products products, amazonfresh.orders orders" +
	" where orders.customer_id = customer.customer_id and billing.order_id = orders.order_id and" +
	" billing.billing_id = billing_items.billing_id and billing_items.product_id = products.product_id and" +
	" products.farmer_id = farmer.farmer_id and customer.customer_id = '" + customerId + "'";*/

console.log("+++++++++++++++++++++++++++++++++++++++");
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
			if(results.length <= 0)
			{
				json_response ={
						"statusCode" : 403,
						"statusMessage" : "No bills matches the search criteria"
				};
				callback(null, json_response);
			}
			else
			{
				json_response ={
						"statusCode" : 200,
						"statusMessage" : "",
						"results" : results
				};
				callback(null, json_response);
			}
		}
	}, query);
};

exports.handle_searchBillDetails_request = function(msg, callback){
	console.log("exports.handle_searchBillDetails_request ~~~~~~~~~~~");
	var json_response = {};
	var category = msg.category;
	var searchString = msg.searchString;

	console.log("/////////////// " + searchString);
	var query = "";
	if(category == 'customer')
	{
		 query="select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price,"+
		 "billing.status, billing.quantity, customer.customer_id, customer.firstname as customer_firstname, "+
		 "customer.lastname as customer_lastname, customer.address as customer_address, customer.city as customer_city, "+
		 "customer.state as customer_state, customer.zip_code as customer_zip_code,  "+
		 "customer.phone_number as customer_phone_number, customer.email as customer_email, "+
		 "products.product_id, products.product_name, billing.price*billing.quantity as price, billing.price as product_price, "+
		 "farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname, "+
		 "farmer.pickup_location, billing.dropoff_location, billing.driver_id, "+
		 "driver.firstname as driver_firstname, driver.lastname as driver_lastname, driver.truck_id, "+
		 "driver.truck_registration_number,billing.current_latitude,billing.current_longitude from "+
		 "amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer farmer,"+
		 "amazonfresh.products products, amazonfresh.driver driver "+
		 "where billing.customer_id='" + searchString + "' and customer.customer_id=billing.customer_id and "+
		 "products.product_id=billing.product_id and farmer.farmer_id=billing.farmer_id and billing.driver_id=driver.driver_id";
		
	}
	else if(category == 'billingid')
	{
		 query="select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price,"+
		 "billing.status, billing.quantity, customer.customer_id, customer.firstname as customer_firstname, "+
		 "customer.lastname as customer_lastname, customer.address as customer_address, customer.city as customer_city, "+
		 "customer.state as customer_state, customer.zip_code as customer_zip_code,  "+
		 "customer.phone_number as customer_phone_number, customer.email as customer_email, "+
		 "products.product_id, products.product_name, billing.price*billing.quantity as price, billing.price as product_price, "+
		 "farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname, "+
		 "farmer.pickup_location, billing.dropoff_location, billing.driver_id, "+
		 "driver.firstname as driver_firstname, driver.lastname as driver_lastname, driver.truck_id, "+
		 "driver.truck_registration_number,billing.current_latitude,billing.current_longitude from "+
		 "amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer farmer,"+
		 "amazonfresh.products products, amazonfresh.driver driver "+
		 "where billing.billing_id='" + searchString + "' and customer.customer_id=billing.customer_id and "+
		 "products.product_id=billing.product_id and farmer.farmer_id=billing.farmer_id and billing.driver_id=driver.driver_id";
		
		 
	/*	query = "select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price," +
		" billing.status, orders.order_id, billing_items.price, billing_items.quantity," +
		" customer.customer_id, customer.firstname as customer_firstname, customer.lastname as customer_lastname," +
		" customer.address as customer_address, customer.city as customer_city, customer.state as customer_state," +
		" customer.zip_code as customer_zip_code,  customer.phone_number as customer_phone_number," +
		" customer.email as customer_email, products.product_id, products.product_name, products.product_price," +
		" products.product_price, farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname" +
		" from amazonfresh.billing billing," +
		" amazonfresh.billing_items billing_items, amazonfresh.customer customer," +
		" amazonfresh.farmer farmer,amazonfresh.products products, amazonfresh.orders orders" +
		" where orders.customer_id = customer.customer_id and billing.order_id = orders.order_id and" +
		" billing.billing_id = billing_items.billing_id and billing_items.product_id = products.product_id and" +
		" products.farmer_id = farmer.farmer_id and billing.billing_id = '" + searchString + "'";*/
	}
	else if(category == 'date')
	{
		query="select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price,"+
		 "billing.status, billing.quantity, customer.customer_id, customer.firstname as customer_firstname, "+
		 "customer.lastname as customer_lastname, customer.address as customer_address, customer.city as customer_city, "+
		 "customer.state as customer_state, customer.zip_code as customer_zip_code,  "+
		 "customer.phone_number as customer_phone_number, customer.email as customer_email, "+
		 "products.product_id, products.product_name, billing.price*billing.quantity as price, billing.price as product_price, "+
		 "farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname, "+
		 "farmer.pickup_location, billing.dropoff_location, billing.driver_id, "+
		 "driver.firstname as driver_firstname, driver.lastname as driver_lastname, driver.truck_id, "+
		 "driver.truck_registration_number,billing.current_latitude,billing.current_longitude from "+
		 "amazonfresh.billing billing, amazonfresh.customer customer, amazonfresh.farmer farmer,"+
		 "amazonfresh.products products, amazonfresh.driver driver "+
		 "where billing.billing_date like '%" + searchString + "%' and customer.customer_id=billing.customer_id and "+
		 "products.product_id=billing.product_id and farmer.farmer_id=billing.farmer_id and billing.driver_id=driver.driver_id";
		
		
		/*query = "select billing.billing_id, billing.billing_date, billing.expected_delivery_time,billing.total_price," +
		" billing.status, orders.order_id, billing_items.price, billing_items.quantity," +
		" customer.customer_id, customer.firstname as customer_firstname, customer.lastname as customer_lastname," +
		" customer.address as customer_address, customer.city as customer_city, customer.state as customer_state," +
		" customer.zip_code as customer_zip_code,  customer.phone_number as customer_phone_number," +
		" customer.email as customer_email, products.product_id, products.product_name, products.product_price," +
		" products.product_price, farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname" +
		" from amazonfresh.billing billing," +
		" amazonfresh.billing_items billing_items, amazonfresh.customer customer," +
		" amazonfresh.farmer farmer,amazonfresh.products products, amazonfresh.orders orders" +
		" where orders.customer_id = customer.customer_id and billing.order_id = orders.order_id and" +
		" billing.billing_id = billing_items.billing_id and billing_items.product_id = products.product_id and" +
		" products.farmer_id = farmer.farmer_id and billing.billing_date like '%" + searchString + "%'";*/
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
			if(results.length <= 0)
			{
				json_response ={
						"statusCode" : 403,
						"statusMessage" : "No bills matches the search criteria"
				};
				callback(null, json_response);
			}
			else
			{
				json_response ={
						"statusCode" : 200,
						"statusMessage" : "",
						"results" : results
				};
				callback(null, json_response);
			}
		}
	}, query);
};