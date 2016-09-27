var mysqlModule = require('mysql');
var mongo = require("./mongo");
var mysql = require("./mysql");
var mongoURL = "mongodb://localhost:27017/amazonFreshFarmersMarket";

var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

exports.handle_listCustomers_request = function(msg, callback){

};

exports.handle_postReview_request = function(msg, callback){

};

exports.handle_fetchDeliveryDetailsForCustomer_request = function(msg, callback){
	console.log("exports.handle_fetchDeliveryDetails_request ~~~~~~~~~~~");
	var json_response = {};
	var customerId = msg.customerId;
	
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
	" billing.status, billing.quantity," + 
	" customer.customer_id, customer.firstname as customer_firstname, customer.lastname as customer_lastname," + 
	" customer.address as customer_address, customer.city as customer_city, customer.state as customer_state," + 
	" customer.zip_code as customer_zip_code,  customer.phone_number as customer_phone_number," +
	" customer.email as customer_email, products.product_id, products.product_name, products.product_price," + 
	" billing.price as product_price, farmer.farmer_id, farmer.firstname as farmer_firstname, farmer.lastname as farmer_lastname," +
	" farmer.pickup_location, billing.dropoff_location," +
	" billing.driver_id, driver.firstname as driver_firstname, driver.lastname as driver_lastname," +
	" driver.truck_id, driver.truck_registration_number" +
	" from amazonfresh.billing billing," +
	" amazonfresh.customer customer," +
	" amazonfresh.farmer farmer,amazonfresh.products products," +
	" amazonfresh.driver driver" +
	" where billing.customer_id = customer.customer_id and" +
	" billing.product_id = products.product_id and" + 
	" products.farmer_id = farmer.farmer_id" + 
	" and driver.driver_id = billing.driver_id" +
	//" and billing.status like '%delivered%' and customer.customer_id = '" + customerId + "'";
	" and customer.customer_id = '" + customerId + "'";*/
	
	console.log("fetch deliver details "+query);

	mysql.fetchData(function (error,results) {
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
