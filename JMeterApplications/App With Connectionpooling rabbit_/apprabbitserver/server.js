//super simple rpc server example
var amqp = require('amqp')
, util = require('util')
, pool = require('./pool')
, fs = require('fs');

var login = require('./services/loginnext')

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	var data  = fs.readFileSync('./pool.conf','utf-8');
	if(data!=null && typeof data != 'undefined'){
		var lines = data.split("\n");
		pool.createPool(lines[0], lines[1])
	}else{
		pool.createPool(100,400)
	}
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