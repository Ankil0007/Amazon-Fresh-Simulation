var MongoClient = require('mongodb').MongoClient;
var dbConnection;
var connected = false;

var optionvalues = {
	db : {
		numberOfRetries : 5
	},
	server : {
		auto_reconnect : true,
		poolSize : 400,
		socketOptions : {
			connectTimeoutMS : 500
		}
	},
	replSet : {},
	mongos : {}
};

var dbConnection;

function initiatePool(url, callback) {
	MongoClient.connect(url, optionvalues, function(err, db) {
		if (err)
			throw err;

		dbConnection = db;
		connected = true;
		callback(dbConnection);
	});
}

exports.connect = function(url, callback) {
	  if(!dbConnection){
		    initiatePool(url, callback)
		  }
		  else{
		    callback(dbConnection);
	 }
};

exports.collection = function(name) {
	if (!connected) {
		throw new Error('Must connect to Mongo before calling "collection"');
	}
	return dbConnection.collection(name);
};