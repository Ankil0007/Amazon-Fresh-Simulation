var express = require('express')
, routes = require('./routes')
, http = require('http')
, path = require('path');

var mongoSessionConnectURL = "mongodb://localhost:27017/login";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
var index = require("./routes/index");
var login = require("./routes/login");
var admin = require("./routes/admin");
var customer = require("./routes/customer");
var farmer = require("./routes/farmer");
var product = require("./routes/product");
var billing = require("./routes/billing");
//var trip = require("./routes/trip");
var passport = require('passport');
require('./routes/passport')(passport);

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressSession({
	secret: 'team8secretcode',
	resave: false, 
	saveUninitialized: false,
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
app.use(passport.initialize());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

function invalidUser(req,res,next){
	if(req.session.email){
		console.log("valid")
		return next();
		
	}else{
		console.log("Invalid")
		res.redirect("/temp")
	}
}


//login
app.get('/', routes.index); 
app.get('/login', routes.index); 
app.post('/afterLogin', login.afterLogin); 
app.post('/afterAdminLogin', login.afterAdminLogin); 
app.post('/logout', login.logout);
app.post('/createAccount', login.createAccount); 
app.post('/saveAddress',login.saveAddress); 
app.post('/saveCardDetails',login.saveCardDetails); 
app.post('/saveFarmerDescription',login.saveFarmerDescription); 
app.post('/deleteAccount',  login.deleteAccount); 
//admin

app.get('/listFarmerRequests',  admin.listFarmerRequests); 
app.get('/listProductRequests',  admin.listProductRequests); 
app.get('/listCustomerRequests',  admin.listCustomerRequests); 
app.post('/approveFarmer',  admin.approveFarmer); 
app.post('/approveProduct',  admin.approveProduct); 
app.post('/approveCustomer',  admin.approveCustomer); 
app.post('/rejectFarmer',  admin.rejectFarmer); 
app.post('/rejectProduct',  admin.rejectProduct); 
app.post('/rejectCustomer',  admin.rejectCustomer); 
app.post('/viewProductForFarmer',  product.viewProductForFarmer);

app.get('/listAllCustomers',  admin.listAllCustomers); 
app.post('/fetchCustomerDetails',  admin.fetchCustomerDetails); 
app.get('/fetchReviewsByCustomer',  admin.fetchReviewsByCustomer);

app.post('/fetchStatisticsData',  admin.fetchStatisticsData); 
app.post('/fetchDeliveryDetails',  admin.fetchDeliveryDetails); 
app.post('/fetchDeliveryDetailsForCustomer',  customer.fetchDeliveryDetailsForCustomer); 
app.post('/fetchRidesDetails',  admin.fetchRidesDetails);
app.post('/searchBillDetails',  admin.searchBillDetails);

app.post('/postReview',  customer.postReview);
app.post('/addReview',  product.addReview);

//farmers
app.get('/listFarmers',  farmer.listFarmers);
app.post('/amendFarmerDetails',  farmer.amendFarmerDetails);
app.post('/searchFarmer',  farmer.searchFarmer);
app.post('/fetchFarmerDetails',  farmer.fetchFarmerDetails);

//product
app.post('/createProduct',  product.createProduct);
app.post('/deleteProduct',  product.deleteProduct);
app.get('/listProducts',  product.listProducts);
app.get('/listAllProducts',  product.listAllProducts); 
app.get('/listAllProductsForAdmin',  product.listAllProductsForAdmin); 
app.post('/viewProduct',  product.viewProduct); 
app.post('/amendProductDetails',  product.amendProductDetails); 
app.post('/searchProduct',  product.searchProduct);
app.post('/fetchProductDetails',  product.fetchProductDetails);

//billing
app.post('/saveCartDetails',  billing.saveCartDetails);
app.post('/createBill',  billing.createBill);
app.post('/deleteBill',  billing.deleteBill);
app.post('/searchBill',  billing.searchBill);
app.post('/placeOrder',  billing.placeOrder);
app.post('/checkout',  billing.checkout);


app.get("/:dynamicroute", routes.index);

mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});