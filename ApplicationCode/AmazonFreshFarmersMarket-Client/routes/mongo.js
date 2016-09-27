var MongoClient = require('mongodb').MongoClient;
var dbconn;
var connected = false;

var optionvalues = {
	db : {
		numberOfRetries : 5
	},
	server : {
		auto_reconnect : true,
		poolSize : 400,
		socketOptions : {
			connectTimeoutMS : 500000
		}
	},
	replSet : {},
	mongos : {}
};

var dbconn;

function initiatePool(url, callback) {
	MongoClient.connect(url, optionvalues, function(err, db) {
		if (err)
			throw err;

		dbconn = db;
		connected = true;
		callback(dbconn);
	});
}

exports.connect = function(url, callback) {
	console.log("here");
	  if(!dbconn){
		  console.log("here1");
		    initiatePool(url, callback)
		  }
		  else{
			  console.log("here2");
		    callback(dbconn);
	 }
};

exports.collection = function(name) {
	if (!connected) {
		throw new Error('Must connect to Mongo before calling "collection"');
	}
	return dbconn.collection(name);
};