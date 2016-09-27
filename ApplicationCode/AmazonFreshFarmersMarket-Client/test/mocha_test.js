/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('Test case for Editing Product Details By its Id', function(done) {
		request.post(
			    'http://localhost:3000/amendProductDetails',
			    { form: { productId: 12,productName:'Banana',productDescription:'Fruit',productPrice:12 } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Test case for list all products', function(done) {
		request.get(
			    'http://localhost:3000/listAllProducts',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Test for Getting Farmer Requests', function(done) {
		request.get(
			    'http://localhost:3000/listFarmerRequests',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Test for Getting Product Requests', function(done) {
		request.get(
			    'http://localhost:3000/listProductRequests',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Test Case for approving farmer', function(done) {
		request.post(
			    'http://localhost:3000/approveFarmer',
			    { form: { farmerId: 100000005 } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});