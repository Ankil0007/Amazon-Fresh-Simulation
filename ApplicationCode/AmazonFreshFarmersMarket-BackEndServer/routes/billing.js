var mysqlModule = require('mysql');
var mongo = require("./mongo");
var mysql = require("./mysql");
var mongoURL = "mongodb://localhost:27017/amazonFreshFarmersMarket";

var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

exports.handle_createBill_request = function(msg, callback){

};

exports.handle_deleteBill_request = function(msg, callback){

};

exports.handle_searchBill_request = function(msg, callback){

};

exports.handle_checkout_request = function(msg, callback){
//console.log("exports.handle_checkout_request ~~~~~~~~~~~");
var customerId = msg.customerId;

	
	var json_response = {};

	var query = "select * from amazonfresh.customer where customer_id = '"+ customerId + "'";

//console.log(query);
	mysql.fetchData(function(error, results) {
		//console.log(results);
		if (error) {
			json_response = {
					"statusCode" : 401,
					"statusMessage" : "Error occured while updating the product details"
			};
			callback(null, json_response);
		} else {
			if(results.length > 0)
			{
			json_response = {
									"statusCode" : 200,
									"statusMessage" : "",
									"results" : results
							};
							callback(null,json_response);
			}else {
							json_response = {
									"statusCode" : 403,
									"statusMessage" : "Couldnot checkout"
							};
							callback(null,json_response);
						}
		}
	}, query);
};

exports.handle_placeOrder_request = function(msg, callback){
    //console.log("exports.handle_placeOrder_request ~~~~~~~~~~~");
    var cart = msg.cart;
    var address = msg.dropofflocation;
    var customerId = msg.customerId;
    var farmers =  cart["farmerWiseProducts"];
    //console.log("Before insertBillingData 77"+cart);
    //console.log("Before insertBillingData 77"+address);
    //console.log("Before insertBillingData 77"+customerId);
    //console.log("Before insertBillingData 77"+farmers);
    insertBillingData(farmers,customerId,address,callback);
    /*mysql.fetchData(function(error, results) {
        //console.log(results);
        if (error) {
            json_response = {
                    "statusCode" : 401,
                    "statusMessage" : "Error occured while updating the product details"
            };
            callback(null, json_response);
        } else {
            if(results.length > 0)
            {
            json_response = {
                                    "statusCode" : 200,
                                    "statusMessage" : "Couldnot amend the details",
                                    "results" : results
                            };
                            callback(null,json_response);
            }else {
                            json_response = {
                                    "statusCode" : 403,
                                    "statusMessage" : "Couldnot checkout"
                            };
                            callback(null,json_response);
                        }
        }
    }, query);*/
};

function insertBillingData(farmers,customerId,address,callback)
{
	//console.log("Insert Billing Data for "+JSON.stringify(farmers));
	var json_response = {},id;
    
    var query = "SELECT COALESCE(MAX(billing_id), 100000000) as max_id FROM   amazonfresh.billing";
    ////console.log(query);
    mysql.fetchData(
            function(error, results) {
                if (error) {
                    json_response = {
                            "statusCode" : 401,
                            "results" : error.code
                    };
                    callback(null, json_response);
                } else {
                    ////console.log(results[0].max_id);
                    if (results.length > 0) {
                        id = parseInt(results[0].max_id) + 1;
                        /*for(var i=0;i<farmers.length;i++)
                            {*/
                        	var isFirstProduct=true;
                        	if(farmers.length==0)
                        	{
                        		var json = {statusCode:200,statusMessage:"Order placed successfully."};
                        		callback(null,json);
                        	}
                        	else
                        	{

                        		id = parseInt(results[0].max_id) + 1;
                        		/*for(var i=0;i<farmers.length;i++)
                                {*/
                            	var isFirstProduct=true;
                                var farmer = farmers[0];
                                var products = farmer.products;
                                //console.log("=====first productssss "+JSON.stringify(products));
                                if(products.length>0)
                                {
                                    var product = products[0];
                                    //console.log("=====First product "+JSON.stringify(products[0]));
                                    //console.log("=====After product "+JSON.stringify(products));
                                    isFirstProduct=false;
                                    var insertQuery = "insert into amazonfresh.billing (billing_id, customer_id, farmer_id, product_id, " +
                                            "price,quantity,total_price,expected_delivery_time,status,driver_id,dropoff_location,billing_date) " +
                                    " values(?,?,?,?,?,?,?,NOW() + INTERVAL 1 DAY,'pending',?,?,NOW())";
                                    //var driverId = Math.floor(Math.random() * 100) + 1;
                                    var driverId = Math.floor(Math.random() * (100000025- 100000000)) + 100000000;
                                    var inputParams = [ id, customerId, farmer.farmer_id,
                                                        product.product_id, product.product_price,product.product_quantity,farmer.total_price,
                                                        driverId ,address];

                                    var insertQuery = mysqlModule.format(insertQuery, inputParams);
                                    
                                    //console.log(insertQuery);
                                    
                                    mysql.fetchData(function(err, results) {
                                        //console
                                        //.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        ////console.log(err);
                                        ////console.log(results);

                                        if (err) {
                                            //console
                                            //.log("//////////////////");
                                            ////console.log(err.code);
                                            json_response = {
                                                    "statusCode" : 401,
                                                    "statusMessage" : err.code
                                            };
                                            callback(null,
                                                    json_response);
                                        } 
                                        else {
                                        	//console.log("=====Remaining products before sent "+JSON.stringify(products));
                                        	products.splice(0,1);
                                        	//console.log("=====Remaining products sent "+JSON.stringify(products));
                                            insertRemainingProducts(products,id,farmer,address,callback,customerId,driverId);
                                        }
                                        },insertQuery);
                                    
                                        farmers.splice(0,1);
                                        //console.log("=====Next farmer===="+JSON.stringify(farmers));
                                        insertBillingData(farmers,customerId,address,callback);
                                    }
                                    else
                                	{
                                    	farmers.splice(0,1);
                                        //console.log("=====Next farmer===="+JSON.stringify(farmers));
                                        insertBillingData(farmers,customerId,address,callback);
                                	}
                        	}
                       }
                   }
                },query);
}

function insertRemainingProducts(products,id,farmer,address,callback,customerId,driverId)
{
    //console.log("Remaining products================"+JSON.stringify(products));
    for(var i=0;i<products.length;i++)
    {
        var product = products[i];
        //console.log("==============product "+i +"================"+JSON.stringify(product));
        
        
        var insertQuery = "insert into amazonfresh.billing (billing_id, customer_id, farmer_id, product_id, " +
				        "price,quantity,total_price,expected_delivery_time,status,driver_id,dropoff_location,billing_date) " +
				" values(?,?,?,?,?,?,?,NOW() + INTERVAL 1 DAY,'pending',?,?,NOW())";
				
				var inputParams = [ id, customerId, farmer.farmer_id,
				                    product.product_id, product.product_price,product.product_quantity,farmer.total_price,
				                    driverId ,address];
				
				var insertQuery = mysqlModule.format(insertQuery, inputParams);
        
	        mysql.fetchData(function(err, results) {
	        
	        if (err) {
	            json_response = {
	                    "statusCode" : 401,
	                    "statusMessage" : err.code
	            };
	            callback(null,json_response);
	        } 
	        else {
	            
	        }
	        },insertQuery);
    }
}