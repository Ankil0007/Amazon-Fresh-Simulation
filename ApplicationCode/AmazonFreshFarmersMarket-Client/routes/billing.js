var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.createBill = function(req,res){

};

exports.deleteBill = function(req,res){
	var billingId = req.param("billingId");

	var msg_payload = { 
			"billingId" : billingId
	};

	mq_client.make_request('deleteBill_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.searchBill = function(req,res){
	var billingId = req.param("billingId");

	var msg_payload = { 
			"billingId" : billingId
	};

	mq_client.make_request('searchBill_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.placeOrder = function(req,res){
    var cart = req.param("cart");
    var address = req.param("dropofflocation");
    var customerId = req.session.customerId;
    var farmers =  cart["farmerWiseProducts"];
    console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");
    console.log(cart);

    var msg_payload = { 
            "cart" : cart,
            "dropofflocation" : address,
            "customerId" : customerId
    };

    mq_client.make_request('placeOrder_queue',msg_payload, function(err,results){
        if(err){
            throw err;
        }
        else 
        {
            res.send(results);                        
        }  
    });
};

exports.saveCartDetails = function(req,res){

};

exports.checkout = function(req,res)
{
	//console.log("-------------------------exports.checkout");
	var customerId = req.session.customerId;
	
	
	var msg_payload = { 
			"customerId" : customerId
	};

	mq_client.make_request('checkout_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
		//console.log(results);
			res.send(results);						
		}  
	});
};


