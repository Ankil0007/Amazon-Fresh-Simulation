
var mysql = require('mysql');
var pool = require('./pool')

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

function fetchData(callback, sqlQuery)
{
	console.log('Query is :' + sqlQuery);
	var connection = getConnection();
	//var connection = pool.getConnectionFromPool();
	connection.query(sqlQuery, function(err, rows, fields) {
		if (err) {
			console.log("Error in fetching data :"+ err.message);
		} else {
			console.log("DB result :" + rows);
			callback(err,rows);
		}
	});
	//console.log("Connection Closed");
	connection.end();
	//pool.releaseConnection(connection);

}

function insertData(callback, sqlQuery)
{
	console.log('Query is :' + sqlQuery);
	//var connection = getConnection();
	var connection = pool.getConnectionFromPool();
	connection.query(sqlQuery, function(err, rows, fields) {
		if (err) {
			console.log("Error in inserting data :"+ err.message);
		} else {
			
			console.log("DB result :" + rows);
			callback(err,rows);
		}
	});
	//console.log("Connection Closed");
	//connection.end();
	//pool.releaseConnection(connection);

}

exports.fetchData = fetchData;
exports.insertData = insertData;