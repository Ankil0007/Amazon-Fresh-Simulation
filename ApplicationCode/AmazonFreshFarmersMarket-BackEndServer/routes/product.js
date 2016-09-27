var mysqlModule = require('mysql');
var mongo = require("./mongo");
var mysql = require("./mysql");
var moment = require('moment');
var mongoURL = "mongodb://localhost:27017/amazonFreshFarmersMarket";


var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

exports.handle_createProduct_request = function(msg, callback) {
	//console.log("exports.handle_createProduct_request ~~~~~~~~~~~");
	var json_response = {};

	var productName = msg.productName;
	var farmerId =  msg.farmerId;
	var productPrice = msg.productPrice;
	var productDescription = msg.productDescription;
	var productQuantity = msg.productQuantity;
	var image =  msg.image;
	var approved = 0;
	var id = 0;

	var query = "SELECT COALESCE(MAX(product_id), 100000000) as max_id FROM   amazonfresh.products";
	//console.log(query);
	mysql.fetchData(
			function(error, results) {
				if (error) {
					json_response = {
							"statusCode" : 401,
							"results" : error.code
					};
					callback(null, json_response);
				} else {
					//console.log(results[0].max_id);
					if (results.length > 0) {
						id = parseInt(results[0].max_id) + 1;
					}

					var insertQuery = "insert into amazonfresh.products (product_id, farmer_id, product_name, product_price, product_description, " +
					"product_quantity, approved) values(?,?,?,?,?,?,?)";

					var inputParams = [ id, farmerId, productName,
					                    productPrice, productDescription,
					                    productQuantity, approved ];

					var insertQuery = mysqlModule.format(insertQuery, inputParams);
					//console.log("-----------!!!!!!!!!!!!!!!!!!!-----------");
					//console.log(insertQuery);

					mysql.fetchData(
							function(err, results) {
								//console
								//.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
								//console.log(err);
								//console.log(results);

								if (err) {
									//console
									//.log("//////////////////");
									//console.log(err.code);
									json_response = {
											"statusCode" : 401,
											"statusMessage" : err.code
									};
									callback(null,
											json_response);
								} else {
									var redisKey = "select * from amazonfresh.products where approved=0";
									client.del(redisKey);
									mongo
									.connect(
											mongoURL,
											function() {
												var coll = mongo
												.collection('product_details');
												coll
												.insert(
														{
															product_id : parseInt(id),
															farmer_id : parseInt(farmerId),
															image : image,
															product_name : productName,
															product_price : parseInt(productPrice),
															product_description : productDescription,
															product_quantity : parseInt(productQuantity),
															approved : parseInt(approved)
														},
														function(
																err,
																results) {

															//console
															//.log(results);
															if (err) {
																//console
																//.log("////////////////// mongo error");
																json_response = {
																		"statusCode" : 401,
																		"statusMessage" : "Unexpected error occured"
																};
																callback(
																		null,
																		json_response);
															} else {
																json_response = {
																		"statusCode" : 200,
																		"statusMessage" : ""
																};
																callback(
																		null,
																		json_response);
															}
														});
											});

								}
							}, insertQuery);
				}
			}, query);

};

exports.handle_deleteProduct_request = function(msg, callback) {
	//console.log("exports.handle_deleteProduct_request ~~~~~~~~~~~");
	var json_response = {};
	var productId = msg.productId;
	var approved = 3;
	var sqlResult = null;
	var query = "update amazonfresh.products set approved =" + approved
	+ " where products.product_id ='" + productId + "'";
	//console.log(query);
	mysql.fetchData(function(error, results) {
		//console.log(results);
		if (error) {
			json_response = {
					"statusCode" : 401,
					"statusMessage" : "Error occured while deleting product"
			};
			callback(null, json_response);
		} else {
			if (results) {

				var redisKey = "select * from amazonfresh.products where approved=0";
				client.del(redisKey);
				//console.log("Before mongo query");
				sqlResult = results;

				mongo.connect(mongoURL, function() {
					var coll = mongo.collection('product_details');
					// //console.log('email ' + email + ' password ' + password);
					coll.updateOne({
						product_id : parseInt(productId)
					}, 
					{$set: { "approved": parseInt(approved) }

					},function(err, results) {

						if (err) {
							json_response = {
									"statusCode" : 401,
									"statusMessage" : "Unexpected error occured"
							};
							callback(null, json_response);
						} else if (results) {
							////console.log(results);
					
							json_response = {
									"statusCode" : 200,
									"statusMessage" : "",
									"mongoResult" : results,
									"sqlResult" : sqlResult
							};
							callback(null, json_response);

						} else {
							json_response = {
									"statusCode" : 403,
									"statusMessage" : "Invalid Product",
									"results" : results
							};
							callback(null, json_response);
						}
					});
				});
			}
		}
	}, query);
};

exports.handle_listProducts_request = function(msg, callback) {
	//console.log("exports.handle_listProduct_request ~~~~~~~~~~~");
	var json_response = {};

	var farmerId = msg.farmerId;


	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('product_details');
		coll.find({
			farmer_id : parseInt(farmerId)
		}).toArray(function(err, results) {

			if (err) {
				json_response = {
						"statusCode" : 401,
						"statusMessage" : "Unexpected error occured"
				};
				callback(null, json_response);
			} 
			else if (results) {
				json_response = {
						"statusCode" : 200,
						"statusMessage" : "",
						"results" : results
				};
				callback(null, json_response);

			} else {
				json_response = {
						"statusCode" : 403,
						"statusMessage" : "Invalid Product",
						"results" : results
				};
				callback(null, json_response);
			}
		});
	});
};

exports.handle_listAllProductsForAdmin_request = function(msg, callback) {
	//console.log("exports.handle_listAllProductsForAdmin_request ~~~~~~~~~~~");
	var json_response = {};

	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('product_details');
		coll.find({"approved":1}).toArray(function(err, results) {

			if (err) {
				json_response = {
						"statusCode" : 401,
						"statusMessage" : "Unexpected error occured"
				};
				callback(null, json_response);
			} 
			else if (results) {
				json_response = {
						"statusCode" : 200,
						"statusMessage" : "Product retrieved successfully",
						"results" : results
				};
				callback(null, json_response);

			} else {
				json_response = {
						"statusCode" : 403,
						"statusMessage" : "Invalid Product",
						"results" : results
				};
				callback(null, json_response);
			}
		});
	});
};






/*exports.handle_listAllProductsForAdmin_request = function(msg, callback) {
    var json_response = {};

    var query = "select * from amazonfresh.products";

    console.log("Sql Query:" + query);

    mysql.fetchData(function(error, results) {
        console.log(error);
        
        if (error) {
            //console.log("In error part");
            //console.log("In error part" + error);
            json_response = {
                    "statusCode" : 401,
                    "statusMessage" : "Unexpected error occured"
            };
            callback(null,json_response);
        } else {
             if (results) {
                        //console.log(results);

                        json_response = {
                                "statusCode" : 200,
                                "statusMessage" : "",
                                "results" : results 
                        };
                        callback(null, json_response);
                    } else {
                        json_response = {
                                "statusCode" : 403,
                                "statusMessage" : "No products found",
                                "results" : results
                        };
                        callback(null, json_response);
                    }
        }

                
        
    
    }, query);
};*/

exports.handle_listAllProducts_request = function(msg, callback) {
	//console.log("exports.handle_listAllProducts_request ~~~~~~~~~~~");
	var json_response = {};
	var approved = 1;
	var sqlResult = null;
	var customerMultiplicationFactor = 5;//msg.customerMultiplicationFactor;
	var multiplicationFactor = getFinalMultiplicationFactor(customerMultiplicationFactor);
	//console.log("Multi Factor"+multiplicationFactor);
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('product_details');
		// //console.log('email ' + email + ' password ' + password);
		
		coll.aggregate(
				[ {$match:
	              {
	                  "approved" : parseInt(approved)
	               }
	         },{$project:{updatedproduct_price:{$multiply:["$product_price",multiplicationFactor]},product_id:"$product_id",product_price:"$product_price",farmer_id:"$farmer_id",image:"$image",product_name:"$product_name",product_description:"$product_description",product_quantity:"$product_quantity",approved:"$approved"}}]
				).toArray(function(err, results) {
			if (err) {
				json_response = {
						"statusCode" : 401,
						"statusMessage" : "Unexpected error occured"
				};
				callback(null, json_response);
			} else if (results) {
				//console.log("****************Most awaited results:"+results);
				json_response = {
						"statusCode" : 200,
						"statusMessage" : "",
						"mongoResult" : results
				};
				console.log(".................");
				callback(null, json_response);

			} else {
				json_response = {
						"statusCode" : 403,
						"statusMessage" : "Invalid Product",
						"results" : results
				};
				callback(null, json_response);
			}
		});
	});
};

exports.handle_viewProduct_request = function(msg, callback) {

	var productId = msg.productId;
	var sqlResult = null;
	var customerMultiplicationFactor = 5;
	var multiplicationFactor = getFinalMultiplicationFactor(customerMultiplicationFactor);
	//console.log("Multi Factor"+multiplicationFactor);
	//console.log("exports.handle_viewProduct_request ~~~~~~~~~~~");
	var json_response = {};

	var query = "select * from amazonfresh.products where product_id ="	+ productId + "";

	console.log("Sql Query:" + query);

	mysql.fetchData(function(error, results) {
		console.log(error);
		
		if (error) {
			//console.log("In error part");
			//console.log("In error part" + error);
			json_response = {
					"statusCode" : 401,
					"statusMessage" : "Unexpected error occured"
			};
			callback(null,json_response);
		} else {
			//console.log("Before mongo query");
			sqlResult = results;

			mongo.connect(mongoURL, function() {
				var coll = mongo.collection('product_details');
				// //console.log('email ' + email + ' password ' + password);
				coll.aggregate(
						[ {$match:
			              {
			                  "product_id" : parseInt(productId)
			               }
			         },{$project:{updatedproduct_price:{$multiply:["$product_price",multiplicationFactor]},product_id:"$product_id",product_price:"$product_price",farmer_id:"$farmer_id",image:"$image",product_name:"$product_name",product_description:"$product_description",product_quantity:"$product_quantity",approved:"$approved",reviews:"$reviews"}}]
						).toArray(function(err, results) {

					if (err) {
						console.log(err);
						json_response = {
								"statusCode" : 401,
								"statusMessage" : "Unexpected error occured"
						};
						callback(null, json_response);
					} else if (results) {
						//console.log(results);

						json_response = {
								"statusCode" : 200,
								"statusMessage" : "",
								"mongoResult" : results,
								"sqlResult" : sqlResult
						};
						callback(null, json_response);
					} else {
						json_response = {
								"statusCode" : 403,
								"statusMessage" : "Invalid Product",
								"results" : results
						};
						callback(null, json_response);
					}

				});
			});
		}
	}, query);
};

exports.handle_viewProductForFarmer_request = function(msg, callback) {
	
	var productId = msg.productId;
	var sqlResult = null;
	console.log("exports.handle_viewProductForAdmin_request ~~~~~~~~~~~");
	var json_response = {};

	var query = "select * from amazonfresh.products where product_id ='"
		+ productId + "'";

	console.log("Sql Query:" + query);

	mysql.fetchData(function(error, results) {
		if (error) {
			console.log("In error part");
			console.log("In error part" + error);
			json_response = {
					"statusCode" : 401,
					"statusMessage" : "Unexpected error occured"
			};
		} else {
			console.log("Before mongo query");
			sqlResult = results;

			mongo.connect(mongoURL, function() {
				var coll = mongo.collection('product_details');
				// console.log('email ' + email + ' password ' + password);
				coll.findOne({
					product_id : parseInt(productId)
				}, function(err, results) {

					if (err) {
						json_response = {
								"statusCode" : 401,
								"statusMessage" : "Unexpected error occured"
						};
						callback(null, json_response);
					} else if (results) {
						console.log(results);

						json_response = {
								"statusCode" : 200,
								"statusMessage" : "",
								"mongoResult" : results,
								"sqlResult" : sqlResult
						};
						callback(null, json_response);
					} else {
						json_response = {
								"statusCode" : 403,
								"statusMessage" : "Invalid Product",
								"results" : results
						};
						callback(null, json_response);
					}

				});
			});
		}
	}, query);
};

exports.handle_amendProductDetails_request = function(msg, callback) {
    var productId = msg.productId;
    var productName = msg.productName;
    var productDescription = msg.productDescription;
    var productPrice = msg.productPrice;
 
 
    //console.log("exports.handle_amendProductDetails_request ~~~~~~~~~~~");
    var json_response = {};
 
    var query = "Update amazonfresh.products set product_name ='" + productName
    + "',product_description = '" + productDescription
    + "',product_price = '" + productPrice
    + "'  where product_id ='" + productId + "'";
 
    //console.log("Sql Query:" + query);
 
    mysql
    .fetchData(
            function(error, results) {
                if (error) {
                    json_response = {
                            "statusCode" : 401,
                            "statusMessage" : "Error occured while updating the product details"
                    };
                    callback(null, json_response);
                } else {
                    if(results)
                    {
                    	 var redisKey = "select * from amazonfresh.products where approved=0";
     					client.del(redisKey);
     					
                        //console.log("Before mongo query");
                        sqlResult = results;
 
                        mongo.connect(
                                        mongoURL,
                                        function() {
                                            var coll = mongo.collection('product_details');
                                          
                                            coll.updateOne(
                                                            {
                                                                product_id : parseInt(productId)
                                                            },
                                                            {
                                                                $set : {
                                                                    "product_name" : productName,
                                                                    "product_description" : productDescription,
                                                                    "product_price" : parseFloat(productPrice),
                                                                }
 
                                                            },
                                                            function(
                                                                    err,
                                                                    results) {
 
                                                                if (err) {
                                                                    json_response = {
                                                                        "statusCode" : 401,
                                                                        "statusMessage" : "Unexpected error occured"
                                                                    };
                                                                    callback(
                                                                            null,
                                                                            json_response);
                                                                } else if (results) {
                                                                   
 
                                                                    json_response = {
                                                                        "statusCode" : 200,
                                                                        "statusMessage" : "",
                                                                        "mongoResult" : results,
                                                                        "sqlResult" : sqlResult
                                                                    };
                                                                    callback(
                                                                            null,
                                                                            json_response);
 
                                                                }
 
                                                            });
                                        });
                    }
                    else {
                         
                        json_response = {
                            "statusCode" : 403,
                            "statusMessage" : "Invalid Product",
                            "results" : results
                        };
                        callback(null, json_response);
 
                    }
 
                }
 
            }, query);
};
exports.handle_searchProduct_request = function(msg, callback) {
	var customerMultiplicationFactor = 5;
	var multiplicationFactor = getFinalMultiplicationFactor(customerMultiplicationFactor);
	//console.log("Multi Factor"+multiplicationFactor);
    var searchString =msg.searchString;
    var json_response = null;
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('product_details');
        // //console.log('email ' + email + ' password ' + password);
        coll.aggregate(
					[ {$match:
		              {
		                  "product_name" :  new RegExp(searchString, "i"),"approved":1
		               }
		         },{$project:{updatedproduct_price:{$multiply:["$product_price",multiplicationFactor]},product_id:"$product_id",product_price:"$product_price",farmer_id:"$farmer_id",image:"$image",product_name:"$product_name",product_description:"$product_description",product_quantity:"$product_quantity",approved:"$approved"}}]
					).toArray(function(err, results) {
            if (err) {
                json_response = {
                    "statusCode" : 401,
                    "statusMessage" : "Unexpected error occured"
                };
            } else if (results) {
                json_response = {
                    "statusCode" : 200,
                    "statusMessage" : "",
                    "mongoResult" : results
                };
               // console.log("Search Product Result"+JSON.stringify(results));
                callback(null, json_response);
 
            } else {
 
                json_response = {
                    "statusCode" : 403,
                    "statusMessage" : "Invalid Product",
                    "results" : results
                };
                callback(null, json_response);
            }
        });
    });
};
exports.handle_addReview__request = function(msg, callback) {
    //console.log("exports.handle_addReview__request ~~~~~~~~~~~");
    var json_response = {};
    var productId = msg.productId;
    var customerId = msg.customerId;
    var firstname = msg.firstname;
    var lastname = msg.lastname;
    var rating = msg.rating;
    var review = msg.review;
    var image = msg.image;
    var video = msg.video;
 
    mongo.connect(mongoURL, function() {
        var coll = mongo.collection('product_details');
        // //console.log('email ' + email + ' password ' + password);
        coll.updateOne(
             { product_id : parseInt(productId)  },
             {
                 $push:{"reviews":{"customer_id":customerId,"firstname":firstname,"lastname":lastname,
                     "rating":rating,"review":review,"image":image,"video":video}}
             }
                 
             
        ,function(err, results) {
 
            if (err) {
                json_response = {
                        "statusCode" : 401,
                        "statusMessage" : "Unexpected error occured"
                };
            } else if (results) {
                json_response = {
                        "statusCode" : 200,
                        "statusMessage" : "",
                        "mongoResult" : results
                };
                callback(null, json_response);
 
            } else {
                json_response = {
                        "statusCode" : 403,
                        "statusMessage" : "Invalid Product",
                        
                };
                callback(null, json_response);
            }
        });
        
    });
 
};

function getFinalMultiplicationFactor(CustomerMultiplicationFactor )																																																																																																																				
{
	var multiplicationFactor = 100/100;
	
	
	var initial = "2013-04-09T09:00:00";
//	var later = "04/09/2013 10:01:00";
	var ms = new moment ().format("HH:mm");
	//var as = moment(later).format("HH:mm");
	var is = moment(initial).format("HH:mm");
	//var d = moment.duration(ms);
	//var s = d.format("hh:mm:ss");
	////console.log("secondDiff"+ms);
	////console.log("secondDiff"+is);
	//moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
	var myfinal = moment.utc(moment(is,"HH:mm").diff(moment(ms,"HH:mm"))).format("HH");
	//console.log("My final "+myfinal);
	if(myfinal=="09"||myfinal=="08"||myfinal=="07"||myfinal=="06"||myfinal=="05"||myfinal=="04"||myfinal=="03"||myfinal=="02"||myfinal=="01"||myfinal=="00")
		{
		multiplicationFactor = (100+CustomerMultiplicationFactor)/100;
		
		}
	else if(myfinal=="24"||myfinal=="23"||myfinal=="22")
		{
		multiplicationFactor = (110+CustomerMultiplicationFactor)/100;
		}
	else if(myfinal=="21"||myfinal=="20"||myfinal=="19")
		{
		multiplicationFactor = (107+CustomerMultiplicationFactor)/100;
		}
	else if(myfinal=="18"||myfinal=="17"||myfinal=="16")
		{
		multiplicationFactor = (104+CustomerMultiplicationFactor)/100;
		}
	else
		{
	 multiplicationFactor = 100/100;
		}
	
	return multiplicationFactor;
	}
 