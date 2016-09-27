var ejs = require('ejs');

function createAccount(req, res){

  var firstName = req.param('firstName');
  var lastName = req.param('lastName');
  var email = req.param('email');
  var password = req.param('password');
  var category = req.param('category');
  
  console.log(firstName+lastName+email+password+category);
  var json = {statuscode:200};
  res.send(json);
}


function splashDelivery(req, res){

	req.session.name = req.param("name");
	req.session.email = req.param('email');
	req.session.password = req.param('password');
	req.session.role = req.param('role');
 var sqlQuery = "select email from "+req.session.role +" where email = '" +req.session.email+"'";
 mysql.insertData(function(err, result) {
		if(err){
			console.log("error occured"+err.message);
		}
		else{
			if(result.length>0){
				json_responses = {
						"statusCode" : 300	
					};
				res.send(json_responses);
			}else{
				json_responses = {
						"statusCode" : 200	
					};
				res.send(json_responses);
			}
		}},sqlQuery);
	
	
	};

	function renderSplashDelivery(req, res){

		  ejs.renderFile('./views/splashdelivery.ejs',{title:'Amazon'},function(err,result){
			 if(!err){
				 res.end(result);
			 } 
			 else{
				 res.end(err);
			 }
		  });
		};
		
function saveAddress(req, res){
			/*req.session.streetaddress = req.param('streetAddress');
			//req.session.optionaladdress = req.param('optionaladdress');
			req.session.city = req.param('city');
			req.session.state = req.param('state');
			req.session.zipcode = req.param('zipCode');
			req.session.phone = req.param('phone');
			*/
	
	var streetAddress = req.param('streetAddress');
	//req.session.optionaladdress = req.param('optionaladdress');
	var city = req.param('city');
	var state = req.param('state');
	var zipCode = req.param('zipCode');
	var phone = req.param('phoneNumber');
	console.log(streetAddress+" "+city+" "+state+" "+zipCode+" "+phone);
	json_responses = {
			"statusCode" : 200	
	};
	res.send(json_responses);
};	

/*function rendersaveAddress(req, res){
	ejs.renderFile('./views/saveAddress.ejs',{title:'Amazon'},function(err,result){
		 if(!err){
			 res.end(result);
		 } 
		 else{
			 res.end(err);
		 }
	  });
	};*/
	
function saveCardDetails(req, res){
		var cardNumber = req.param('cardNumber');
		var cardHolderName = req.param('cardHolderName');
		var cardExpirationMonth = req.param('cardExpirationMonth');
		var cardExpiryYear = req.param('cardExpiryYear');
		console.log(cardNumber+" "+cardHolderName+" "+cardExpirationMonth+" "+cardExpiryYear);
		var sqlQuery;
		if(1==1){
			/*sqlQuery = "insert into customer (name,address,city,state,zip_code,phone_number,email,credit_card_no" +
					",card_holder_name,expiration_month,expiration_year) values ('"+req.session.name+"','"+(req.session.streetaddress+req.session.optionaladdress)+"','"+
					req.session.city+"','"+req.session.state+"','"+req.session.zipcode+"','"+req.session.phone+"','"+
					req.session.email+"',"+req.session.cardno+",'"+req.session.cardholdername+"',"+req.session.expirationmonth+","+req.session.expirationyear+")"*/
				
			
		}
		/*else if(req.session.role == "farmer"){
			sqlQuery = "insert into farmer (name,address,city,state,zip_code,phone_number,email,credit_card_no" +
			",card_holder_name,expiration_month,expiration_year) values ('"+req.session.name+"','"+(req.session.streetaddress+req.session.optionaladdress)+"','"+
			req.session.city+"','"+req.session.state+"','"+req.session.zipcode+"','"+req.session.phone+"','"+
			req.session.email+"',"+req.session.cardno+",'"+req.session.cardholdername+"',"+req.session.expirationmonth+","+req.session.expirationyear+")"
		}*/
		
		/*mysql.insertData(function(err, result) {
			if(err){
				console.log("error occured"+err.message);
			}
			else{
				mongo.connect(mongoURL, function(){
					console.log('Connected to mongo at: ' + mongoURL);
					var coll = mongo.collection('login_credentials');
					var mongoinsert  ={userid:result.insertId,email: req.session.email, password:req.session.password,role:req.session.role};
					coll.insert(mongoinsert, function(err, user){
						if (err) {
							// This way subsequent requests will know the user is logged in.
							json_responses = {"statusCode" : 401};
							res.send(json_responses);

						} else {
							console.log(result.insertId);
							json_responses = {
									"statusCode" : 200	
								};
							res.send(json_responses);
							
							
						}
					});
				});				
				}},sqlQuery);*/
		json_responses = {
				"statusCode" : 200	
			};
		res.send(json_responses);
}

function farmerSignup(req,res)
{
	
	json_responses = {
			"statusCode" : 200	
		};
	res.send(json_responses);
}
function navigateToUserPage(req, res){
			ejs.renderFile('./views/userhomepage.ejs',{title:'Amazon'},function(err,result){
				 if(!err){
					 res.end(result);
				 } 
				 else{
					 res.end(err);
				 }
			  });
			};
		
exports.navigateToUserPage  = navigateToUserPage;		
exports.saveCardDetails = saveCardDetails;
exports.saveAddress = saveAddress;
exports.splashDelivery = splashDelivery;
//exports.renderSplashDelivery = renderSplashDelivery;
exports.createAccount = createAccount;
exports.farmerSignup=farmerSignup;