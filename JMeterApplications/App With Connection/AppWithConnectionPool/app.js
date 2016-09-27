/**
 * Module dependencies.
 */

var express = require('express')
,routes = require('./routes')
, session = require('client-sessions')
,cookieParser = require('cookie-parser')
,http = require('http')
,path = require('path')
,favicon = require('serve-favicon')
, login = require('./routes/login/login')
, loginnext = require('./routes/login/loginnext')
, logout = require('./routes/logout')
, pool = require('./routes/pool')
, fs = require('fs');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({

	cookieName : 'session',
	secret : 'cmpe273_test_string',
	duration : 30 * 60 * 1000, //setting the time for active session
	activeDuration : 5 * 60 * 1000,
}));
app.use(app.router);

//app.use(session({secret: 'ssshhhhh',resave: true, saveUninitialized: true}));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());	
}

var data  = fs.readFileSync('./public/config/pool.conf','utf-8');
if(data!=null && typeof data != 'undefined'){
	var lines = data.split("\n");
	pool.createPool(lines[0], lines[1])
}else{
	pool.createPool(100,400)
}


app.get('/', routes.index);
app.get('/login/login', login.home);
app.get('/logout', logout.logout);
app.post('/login/loginnext', loginnext.loginnext);

/*app.get('*', function(req, res) {
	
	res.redirect('/');
	
})*/

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
