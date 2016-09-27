var ejs = require('ejs');

exports.index = function(req, res){
res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

	ejs.renderFile('./views/index.html',function(err, result) {
		if (!err) 
		{
			res.end(result);
		}
		else {
			res.end('An error occurred');
		}
	});	
};


exports.adminLogin = function(req, res){
res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	
	ejs.renderFile('./views/index.html',function(err, result) {
		if (!err) 
		{
			res.end(result);
		}
		else {
			res.end('An error occurred');
		}
	});
};