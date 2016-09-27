var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.viewProduct = function(req,res){
	var productId = req.param("productId");
	//console.log("In node" +productId )
	var msg_payload = { 
			"productId" : productId
	};

	mq_client.make_request('viewProduct_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 	
		{
			res.send(results);						
		}  
	});
};


exports.viewProductForFarmer = function(req,res){
	var productId = req.param("productId");
	//console.log("In node" +productId )
	var msg_payload = { 
			"productId" : productId
	};

	mq_client.make_request('viewProductForFarmer_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 	
		{
			res.send(results);						
		}  
	});
}
exports.createProduct = function(req,res){
	console.log("----------------exports.createProduct-------------------");
	//console.log(req);
	var farmerId = req.session.farmerId;
	
	var productName = req.param("productName");	
	var productPrice = req.param("productPrice");
	var productDescription = req.param("productDescription");
	var productQuantity = req.param("productQuantity");
	var image = req.param("productImage");
	
	console.log(image);
	//console.log("sssssssssssssssssssssssssss");
	
	
	var msg_payload = { 
			"productName" : productName,
			"farmerId" : farmerId,
			"productPrice" : productPrice,
			"productDescription" : productDescription,
			"productQuantity" : productQuantity,
			"image":image
	};
//console.log(msg_payload);
	mq_client.make_request('createProduct_queue',msg_payload, function(err,results){
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

exports.deleteProduct = function(req,res){
	var productId = req.param("productId");

	var msg_payload = { 
			"productId" : productId
	};

	mq_client.make_request('deleteProduct_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.listProducts = function(req,res){
	//console.log("*****************************************exports.listProducts ");
	
	var farmerId = req.session.farmerId ;
	var msg_payload = { 
			"farmerId" : farmerId
	};

	mq_client.make_request('listProducts_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);
		}  
	});
};

exports.listAllProducts = function(req,res){
//console.log("===============exports.listAllProducts");
	var msg_payload = { };

	mq_client.make_request('listAllProducts_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
		//console.log("from client product"+results);
		//console.log(results);
			res.send(results);						
		}  
	});
};

exports.listAllProductsForAdmin = function(req,res){
//console.log("===============exports.listAllProducts");
	var msg_payload = { };

	mq_client.make_request('listAllProductsForAdmin_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			//console.log("result from client"+results);
			res.send(results);						
		}  
	});
};

exports.amendProductDetails = function(req,res){
	//console.log("---------------exports.amendProductDetails")
	
	var productId = req.param("productId");	
	var productName = req.param("productName");
	var productDescription = req.param("productDescription");
	var productPrice = req.param("productPrice");
	
	var msg_payload = { 
			"productId" : productId,
			"productName" : productName,
			"productDescription" : productDescription,
			"productPrice":productPrice
	};

	mq_client.make_request('amendProductDetails_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.searchProduct = function(req,res){
	var searchString = req.param("searchString");

	var msg_payload = { 
			"searchString" : searchString
	};

	mq_client.make_request('searchProduct_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.fetchProductDetails = function(req,res){
	var productID = req.param("productID");

	var msg_payload = { 
			"productID" : productID
	};

	mq_client.make_request('fetchProductDetails_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};

exports.addReview = function(req,res){
	var productId = req.param("productId");
	var customerId = req.session.customerId;
	var firstname = req.session.firstname;
	var lastname = req.session.lastname;
	var rating = req.param("rating");
	var review = req.param("review");
	var image = req.param("image");
	var video = req.param("video");

	var msg_payload = { 
			"productId" : productId,
			"customerId" : customerId,
			"firstname" : firstname,
			"lastname" : lastname,
			"rating" : rating,
			"review" : review,
			"image" : image,
			"video" : video			
	};

	mq_client.make_request('addReview_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.send(results);						
		}  
	});
};