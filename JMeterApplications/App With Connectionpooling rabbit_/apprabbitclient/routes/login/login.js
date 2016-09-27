
/*
 * GET home page.
 */
var ejs = require('ejs');
function home(req, res){

  ejs.renderFile('./views/login/login.ejs',{title:'Twitter'},function(err,result){
	 if(!err){
		 res.end(result);
	 } 
	 else{
		 res.end(err);
	 }
  });
};

exports.home = home;