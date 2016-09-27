var mysql = require('mysql');
var List = require("collections/list")
var maxPoolSize;
var connectionpool;
var connectioncount=0;

function getConnection() {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root',
		database : 'twitter',
		port : 3306
	})
	return connection;
}

function createPool(initialSize,maxSize){
	console.log("Connectionpool is created")
	connectionpool = new List();
	maxPoolSize = maxSize;
	for(var i=0;i<initialSize;i++){
		connectionpool.push(getConnection());
	}
}

function getConnectionFromPool(){
	if(connectionpool.length == 0){
		
		if(connectioncount!=maxSize){
		connectioncount++;
		
		return getConnection();
		}
		else{
			console.log("No connections are available on connectionpool!!!")
			return null;
		}
	}else{
		connectioncount++;
		
		return connectionpool.pop();
	}
	
}

function releaseConnection(connection){
	connectioncount--;
	
	connectionpool.push(connection);
	
}

exports.createPool = createPool;
exports.getConnectionFromPool = getConnectionFromPool;
exports.releaseConnection = releaseConnection;
