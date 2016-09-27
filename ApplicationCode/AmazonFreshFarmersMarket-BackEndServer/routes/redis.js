/**
 * http://usejsdoc.org/
 */
var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

client.on("error", function (err) {
    console.log("Error connecting REDIS Cache Server " + err);
});

exports.cacheClients = function(clients) {
	console.log("select * from amazonfresh.farmer where approved= 0");
	client.set("select * from amazonfresh.farmer where approved= 0", JSON.stringify(clients));
};

exports.cacheClients = function(clients) {
	console.log("in redis select * from amazonfresh.customer where approved= 0");
	client.set("select * from amazonfresh.customer where approved= 0", JSON.stringify(clients));
};

exports.cacheClients = function(clients) {
	console.log("in redis select * from amazonfresh.products where approved= 0");
	client.set("select * from amazonfresh.products where approved= 0", JSON.stringify(clients));
};