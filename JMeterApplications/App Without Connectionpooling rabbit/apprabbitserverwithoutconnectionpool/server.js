//super simple rpc server example
var amqp = require('amqp')
, util = require('util')
, pool = require('./pool')
, fs = require('fs');

var login = require('./services/loginnext')

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	console.log("listening on queues");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			//util.log(util.format( deliveryInfo.routingKey, message));
	
			
			login.handle_request(message, function(err,res){
				console.log("Heyyyyy in server")
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});