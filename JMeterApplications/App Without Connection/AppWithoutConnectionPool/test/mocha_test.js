/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('Test case for authentication', function(done) {
		request.post(
			    'http://localhost:3000/login/loginnext',
			    { form: { loginid: 'abcde',loginpassword:'trademark' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Test for redirecting to home page of requested person', function(done) {
		request.get(
			    'http://localhost:3000/personhomepage/89',
			    { form: { userid: 89 } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Test for getting requested person tweets', function(done) {
		request.get(
			    'http://localhost:3000/getpersontweetlist/109',
			    { form: { userid: 109 } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Test for getting followers of requested person', function(done) {
		request.get(
			    'http://localhost:3000/getpersonfollowerslist/109',
			    { form: { userid: 109 } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	it('Test for getting followings of requested person', function(done) {
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