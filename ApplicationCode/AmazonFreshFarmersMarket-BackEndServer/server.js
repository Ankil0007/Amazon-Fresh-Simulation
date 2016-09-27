var amqp = require('amqp')
, util = require('util');

var mysql = require('./routes/mysql');
mysql.createConnectionPool(1000);

var redis = require('redis');
var client = redis.createClient();

client.on('error',function(error){
	console.log("Error while opening the Socket Connection");	
});

client.on('connect', function() {
	console.log('redis connected');
});

var login = require('./routes/login');
var farmer = require('./routes/farmer');
var customer = require('./routes/customer');
var product = require('./routes/product');
var billing = require('./routes/billing');
var admin = require('./routes/admin');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	cnn.queue('createAccount_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			login.handle_createAccount_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('saveCardDetails_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			login.handle_saveCardDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('saveFarmerDescription_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			login.handle_saveFarmerDescription_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});	

	cnn.queue('afterLogin_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			login.handle_afterLogin_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('adminLogin_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			login.handle_adminLogin_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('deleteAccount_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			login.handle_deleteAccount_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('listFarmers_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			farmer.handle_listFarmers_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('amendFarmerDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			farmer.handle_amendFarmerDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('searchFarmer_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			farmer.handle_searchFarmer_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('fetchFarmerDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			farmer.handle_fetchFarmerDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('createProduct_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_createProduct_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('deleteProduct_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_deleteProduct_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('listProducts_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_listProducts_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('listAllProducts_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_listAllProducts_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

cnn.queue('listAllProductsForAdmin_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_listAllProductsForAdmin_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('amendProductDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_amendProductDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('searchProduct_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_searchProduct_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('listAllCustomers_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_listAllCustomers_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('fetchCustomerDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_fetchCustomerDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('fetchReviewsByCustomer_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_fetchReviewsByCustomer_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('fetchProductDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_fetchProductDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('listCustomers_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			customer.handle_listCustomers_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('postReview_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			customer.handle_postReview_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('createBill_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			billing.handle_createBill_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('deleteBill_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			billing.handle_deleteBill_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('searchBill_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			billing.handle_searchBill_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

cnn.queue('checkout_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			billing.handle_checkout_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('placeOrder_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			billing.handle_placeOrder_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('listFarmerRequests_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_listFarmerRequests_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('listProductRequests_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_listProductRequests_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('listCustomerRequests_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_listCustomerRequests_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('approveFarmer_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_approveFarmer_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('approveProduct_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_approveProduct_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('approveCustomer_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_approveCustomer_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('rejectFarmer_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_rejectFarmer_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('rejectProduct_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_rejectProduct_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('rejectCustomer_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_rejectCustomer_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('viewProduct_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_viewProduct_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('viewProductForFarmer_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_viewProductForFarmer_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('fetchStatisticsData_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_fetchStatisticsData_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('fetchDeliveryDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_fetchDeliveryDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('fetchDeliveryDetailsForCustomer_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log('fetch at server');
			customer.handle_fetchDeliveryDetailsForCustomer_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	

	cnn.queue('fetchRidesDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_fetchRidesDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	cnn.queue('searchBillDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			admin.handle_searchBillDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('fetchFarmerDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			farmer.handle_fetchFarmerDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});	
	cnn.queue('amendFarmerDetails_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			farmer.handle_amendFarmerDetails_request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('addReview_queue', function(q){		
		q.subscribe(function(message, headers, deliveryInfo, m){
			product.handle_addReview__request(message, function(err,res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});