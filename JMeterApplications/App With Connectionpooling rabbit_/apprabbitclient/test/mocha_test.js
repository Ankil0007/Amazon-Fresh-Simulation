/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('Mocha Test for initializing client session in mongo', function(done) {
		request.post(
			    'http://localhost:3000/login/loginnext',
			    { form: { loginid: 'ankil_shah',loginpassword:'trademark' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Mocha Test for getting the login page on hitting URL', function(done) {
		request.get(
			    'http://localhost:3000/',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	
	it('Mocha Test for getting followers count of requested person', function(done) {
		request.get(
			    'http://localhost:3000/getpersonfollowerslist/109',
			    { form: { userid: 109 } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	

	it('Mocha Test for getting total number of tweet count', function(done) {
		request.get(
			    'http://localhost:3000/getpersontweetlist/109',
			    { form: { userid: 109 } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Mocha Test for getting following count of requested person', function(done) {
		request.get(
			    'http://localhost:3000/getpersonfollowinglist/109',
			    { form: { userid: 109 } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});