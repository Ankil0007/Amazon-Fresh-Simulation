var mysql = require('mysql');
var listOfConnections = require("collections/list")
var connectionPool;

function getConnection(){
	var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'amazonfresh',
	port : 3306
});
	return connection;
}

exports.createConnectionPool = function(noOfConnections){
	connectionPool = new listOfConnections();
	for(var i=0;i<noOfConnections;i++){
		connectionPool.push(getConnection());
	}
};

var getConnectionFromConnectionPool = function (){
	if(connectionPool.length == 0){
		return getConnection();
	}else{
		return connectionPool.pop();
	}
};

releaseConnection = function(connection){
	connectionPool.push(connection);	
};

exports.fetchData = function(callback,sqlQuery){
	var connection=getConnectionFromConnectionPool();
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		callback(err, rows);		
	});
	releaseConnection(connection);
};	
