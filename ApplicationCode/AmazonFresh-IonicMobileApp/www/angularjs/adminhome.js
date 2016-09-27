amazonfresh.controller('admin', function($scope, $http, $state, $rootScope) {
	$scope.logout = function() {
		$http({
			method : "POST",
			url : 'http://localhost:3000/logout',
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				
			}
			else if (data.statusCode == 401) {
				
			}
			else
				{
				$state.transitionTo("login");
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
			
		});
		
	}
	$scope.showMap= true;
	$scope.showBillModal = false;
	$scope.showRevenue= true;
	$scope.viewrequests = function() {
		$state.transitionTo("adminsuccessful");
	}
	
	$scope.searchbill = function() {
		$state.transitionTo("searchbill");
	}
	$scope.statisticsdata = function() {
		$state.transitionTo("deliverydetails");
	}
	$scope.viewfarmernames = function() {
		$scope.farmernames = false;
		$scope.farmerinfo = true;
		//var area =document.getElementById("inputarea").value;
		$scope.limitfarmerdetails=10;
		$http({
			method : "GET",
			url : 'http://localhost:3000/listfarmers',
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.farmernames = true;
				$scope.statusMessage = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.farmernames = true;
				$scope.statusMessage = data.statusMessage;
			}
			else
				{
				 $scope.farmers = data.results;
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
			
		});
		
	}
    $scope.loadmorefarmerdetails=function(){
		var increamented = $scope.limitfarmerdetails + 10;
		$scope.limitfarmerdetails = increamented >$scope.farmers.length ? $scope.farmers.length : increamented;
	}
	$scope.viewfarmeraccounts  = function(){
		$state.transitionTo("viewFarmers");
	}
    $scope.searchFarmer = function() {
    	if($scope.searchStr.lenght<=0){
    		$scope.viewfarmernames();
    		return false;
    	}
    	$http({
			method : "POST",
			url : 'http://localhost:3000/searchFarmer',
			data:
				{
				"searchString":$scope.searchStr
				}
		}).success(function(data) {
			
			if (data.statusCode == 403) {
				$scope.farmernames = true;
				$scope.statusMessage = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.farmernames = true;
				$scope.statusMessage = data.statusMessage;
			}
			else
				{
				 $scope.farmers = data.results;
				}
		}).error(function(error) {
			
			
		});
    }
    
    $scope.showFarmerDetail1 = function(farmer_id) {
    	
		$http({
			method : "POST",
			url : 'http://localhost:3000/fetchFarmerDetails',
			data:
				{
				"farmerId":farmer_id
				}
		}).success(function(data) {
			
			if (data.statusCode == 403) {
				$scope.farmerinfo = true;
			}
			else if (data.statusCode == 401) {
				$scope.farmerinfo = true;
			}
			else
				{
				$scope.farmerinfo = false;
				$scope.farmerdescription = data.mongoResult;
				document.getElementById("profilevideo").src = data.mongoResult.video;
				$scope.farmerdetails = data.sqlResult[0];
				}
		}).error(function(error) {
			
			
		});
	}
	$scope.viewcustomeraccounts = function() {
		$state.transitionTo("customerdetails");
	}
	$scope.initFarmerApprovals = function() {
		$scope.showFarmerModal = false;
		$scope.showCustomerModal = false;
		$scope.showProductModal = false;
		$scope.loadf =false;
		$scope.hideFarmer = false;
		$scope.limitfarmers=10;
		$http({
			method : "GET",
			url : 'http://localhost:3000/listFarmerRequests',
		}).success(function(data) {
			
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.hideFarmer = true;
				$scope.statusMessageFarmer = data.statusMessage;
				$scope.loadf =true;
				
			}
			else if (data.statusCode == 401) {
				$scope.loadf =true;
				$scope.statusMessageFarmer = data.statusMessage;
			}
			else
				{
			
				 $scope.listFarmerApprovals = data.results;

				}
		}).error(function(error) {
			$scope.statusMessageFarmer = data.statusMessage;
			
		});
	}
	$scope.loadmorefarmers=function(){
		var increamented = $scope.limitfarmers + 10;
		$scope.limitfarmers = increamented >$scope.listFarmerApprovals.length ? $scope.listFarmerApprovals.length : increamented;
	}

	$scope.initCustomerApprovals = function() {
		$scope.hideCustomer = false;
		$scope.norequests = true;
		$scope.loadc =false;
		$scope.limitcustomers=10;
		$http({
			method : "GET",
			url : 'http://localhost:3000/listCustomerRequests',
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.hideCustomer = true;
				$scope.loadc =true;
				$scope.statusMessageCustomer = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.loadc =true;
				$scope.statusMessageCustomer = data.statusMessage;
			}
			else
				{
				 $scope.listCustomerApprovals = data.results;
				}
		}).error(function(error) {
			
			$scope.statusMessageCustomer = data.statusMessage;
		});
	}
	$scope.loadmorecustomers=function(){
		var increamented = $scope.limitcustomers + 10;
		$scope.limitcustomers = increamented >$scope.listCustomerApprovals.length ? $scope.listCustomerApprovals.length : increamented;
	}
	
	$scope.initProductApprovals = function() {
		$scope.hideProduct = false;
		$scope.loadp =false;
		$scope.limitproducts=10;
		$http({
			method : "GET",
			url : 'http://localhost:3000/listProductRequests',
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.hideProduct = true;
				$scope.loadp =true;
				$scope.statusMessageProduct = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.loadp =true;
				$scope.statusMessageProduct = data.statusMessage;
			}
			else
				{
				 $scope.listProductApprovals = data.results;
				}
		}).error(function(error) {
			$scope.statusMessageProduct = data.statusMessage;
			
		});
	}
	
	$scope.loadmoreproducts=function(){
		var increamented = $scope.limitproducts + 10;
		$scope.limitproducts = increamented >$scope.listProductApprovals.length ? $scope.listProductApprovals.length : increamented;
	}
	
// Approval Acceptance Functions
	$scope.approveFarmer = function(farmer_id) {
		
		$http({
			method : "POST",
			url : 'http://localhost:3000/approveFarmer',
			data : {
				"farmerId":farmer_id
			}
		}).success(function(data) {
			//checking the response data for statusCode
			
			if (data.statusCode == 403) {	
				$scope.initFarmerApprovals();
			}
			else if (data.statusCode == 401) {
				
				$scope.unexpected_error = false;
			}
			else
				{
				 $scope.initFarmerApprovals();
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			
		});
	}
	$scope.approveCustomer = function(customer_id) {
		
		$scope.unexpected_error = true;
		$http({
			method : "POST",
			url : 'http://localhost:3000/approveCustomer',
			data : {
				"customerId":customer_id
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.initCustomerApprovals();
			}
			else if (data.statusCode == 401) {
				$scope.unexpected_error = false;
			}
			else
				{
				 $scope.initCustomerApprovals();
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			
		});
	}
	$scope.approveProduct = function(product_id) {
		
		$scope.unexpected_error = true;
		$http({
			method : "POST",
			url : 'http://localhost:3000/approveProduct',
			data : {
				"productId":product_id
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.initProductApprovals();
			}
			else if (data.statusCode == 401) {
				$scope.unexpected_error = false;
			}
			else
				{
				 $scope.initProductApprovals();
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			
		});
	}
// Approval Rejection Function
	$scope.rejectFarmer = function(farmer_id) {
		
		$scope.unexpected_error = true;
		$http({
			method : "POST",
			url : 'http://localhost:3000/rejectFarmer',
			data : {
				"farmerId":farmer_id
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.initFarmerApprovals();
			}
			else if (data.statusCode == 401) {
				$scope.unexpected_error = false;
			}
			else
				{
				 $scope.initFarmerApprovals();
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			
		});
	}
	$scope.rejectCustomer = function(customer_id) {
		
		$scope.unexpected_error = true;
		$http({
			method : "POST",
			url : 'http://localhost:3000/rejectCustomer',
			data : {
				"customerId":customer_id
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.initCustomerApprovals();
			}
			else if (data.statusCode == 401) {
				$scope.unexpected_error = false;
			}
			else
				{
				 $scope.initCustomerApprovals();
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			
		});
	}
	$scope.rejectProduct = function(product_id) {
		
		$scope.unexpected_error = true;
		$http({
			method : "POST",
			url : 'http://localhost:3000/rejectProduct',
			data : {
				"productId":product_id
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.initProductApprovals();
			}
			else if (data.statusCode == 401) {
				$scope.unexpected_error = false;
			}
			else
				{
				 $scope.initProductApprovals();
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			
		});
	}
	
	//Showing Detail Function
	
	$scope.showFarmerDetail = function(index) {
		$scope.farmerfirstname = $scope.listFarmerApprovals[index].fistname;
		$scope.farmerlastname = $scope.listFarmerApprovals[index].lastname;
		$scope.farmeraddress = $scope.listFarmerApprovals[index].address;
		$scope.farmercity = $scope.listFarmerApprovals[index].city;
		$scope.farmerstate = $scope.listFarmerApprovals[index].state;
		$scope.farmerzipcode = $scope.listFarmerApprovals[index].zipcode;
		$scope.farmeremail = $scope.listFarmerApprovals[index].email;
	
		$scope.showFarmerModal = !$scope.showFarmerModal;
	}
	$scope.showCustomerDetail = function(index) {
		$scope.customerfirstname = $scope.listCustomerApprovals[index].fistname;
		$scope.customerlastname = $scope.listCustomerApprovals[index].lastname;
		$scope.customeraddress = $scope.listCustomerApprovals[index].address;
		$scope.customercity = $scope.listCustomerApprovals[index].city;
		$scope.customerstate = $scope.listCustomerApprovals[index].state;
		$scope.customerzipcode = $scope.listCustomerApprovals[index].zipcode;
		$scope.customeremail = $scope.listCustomerApprovals[index].email;
		
		$scope.showCustomerModal = !$scope.showCustomerModal;
	}
	$scope.showProductDetail = function(index) {
		$scope.productname = $scope.listProductApprovals[index].product_name;
		$scope.farmerfirstname = $scope.listProductApprovals[index].lastname;
		$scope.farmerlastname = $scope.listProductApprovals[index].address;
		$scope.productprice = $scope.listProductApprovals[index].product_price;
		$scope.productdescription = $scope.listProductApprovals[index].product_description;
		$scope.productquantity = $scope.listProductApprovals[index].product_quantity;
		
		
		$scope.showProductModal = !$scope.showProductModal;
	}
	
	//Rides
	
	$scope.viewridedata = function() {
		$state.transitionTo("ridedetails");
	}
	$scope.searchride = function() {	
		var searchString = "";
		var category = document.getElementById("category").value;
		if(category == "area"){
			searchString = document.getElementById("searchstring").value;
		}
		else if(category == "driver"){
			searchString = document.getElementById("searchstring").value;
			if(searchString.length!=9 || isNaN(searchString) )
				{
				alert("Invalid Input, (Hint:SSN format with 9 digit) ");
				return false;
				}
		}
		else{
			searchString = document.getElementById("searchstring").value;
			if(searchString.length!=9 || isNaN(searchString) )
			{
			alert("Invalid Input!, (Hint:SSN format with 9 digit) ");
			return false;
			}
		} 
		
			$http({
				method : "POST",
				url : 'http://localhost:3000/fetchRidesDetails',
				data : {
					"category":document.getElementById("category").value,
					"searchString":searchString
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 403) {
					$scope.showMap= true;
					$scope.statusMessageRideSearch= data.statusMessage;
				
				}
				else if (data.statusCode == 401) {
					$scope.showMap= true;
					$scope.statusMessageRideSearch = data.statusMessage;
				}
				else
					{
					$scope.showMap= false;
					$scope.rides = data.results;
					var map = new google.maps.Map(document.getElementById('map'), {
					      zoom: 8,
					      center: new google.maps.LatLng(37.3433, -121.8854),
					      mapTypeId: google.maps.MapTypeId.TERRAIN
					    });

						
						var points = '{"points":'+JSON.stringify(data.results)+'}';
							var pointsObject = JSON.parse(points);
							
							for (var point in pointsObject.points)
							{
							 geocodeLine1(pointsObject.points[point].pickup_location_latitude, pointsObject.points[point].pickup_location_longitude,pointsObject.points[point].dropoff_location_latitude, pointsObject.points[point].dropoff_location_longitude);		
							}
							
					       
					    function geocodeLine1(pointLat1, pointLon1,pointLat2,pointLon2)
					    {
					        var gc = new google.maps.Geocoder();
							
							 
							 	  
								  var source = new google.maps.LatLng(pointLat1, pointLon1);

					  // Draw a circle around the radius
					  var circle = new google.maps.Circle({
					    center: source,
					    radius: 2000, //convert miles to meters
					    strokeColor: "#0000FF",
					    strokeOpacity: 0.4,
					    strokeWeight: 4,
					    fillColor: "#0000FF",
					    fillOpacity:0.4
					   });          
					   circle.setMap(map);  
					   
					   var destination = new google.maps.LatLng(pointLat2, pointLon2);

					  // Draw a circle around the radius
					  var circle = new google.maps.Circle({
					    center: destination,
					    radius: 1000, //convert miles to meters
					    strokeColor: "#0000FF",
					    strokeOpacity: 0.4,
					    strokeWeight: 4,
					    fillColor: "#0000FF",
					    fillOpacity: 0.4
					   });          
					   circle.setMap(map); 
									  
					              new google.maps.Polyline({
					                path: [
					                  new google.maps.LatLng(pointLat1, pointLon1), 
									  new google.maps.LatLng(pointLat2, pointLon2)
					                ],
					                strokeColor: '#FF0000',
									strokeWeight: 1,
					                geodesic: true,
					                map: map
					                });
					    }
					
					
					$scope.showMap = false;
					}
			}).error(function(error) {
				$scope.statusMessage = data.statusMessage;
				
			});
		}
	$scope.searchbillby = function() {
		var searchString = "";
		var category = document.getElementById("category").value;
		if(category == "date"){
			searchString = document.getElementById("inputdate").value;
		}
		else if(category == "customer"){
			searchString = document.getElementById("inputcustomername").value;
			if(searchString.length!=9 || isNaN(searchString) )
				{
				alert("Invalid Input, (Hint:SSN format with 9 digit) ");
				return false;
				}
		}
		else{
			searchString = document.getElementById("inputbillingid").value;
			if(searchString.length!=9 || isNaN(searchString) )
			{
			alert("Invalid Input!, (Hint:SSN format with 9 digit) ");
			return false;
			}
		}
		
		$http({
			method : "POST",
			url : 'http://localhost:3000/searchBillDetails',
			data : {
				"searchString":searchString,
				"category" : category
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.showMap= true;
				$scope.statusMessage = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.showMap= true;
				$scope.statusMessage = data.statusMessage;
			}
			else
				{
				$scope.showMap= false;
				$scope.statusMessage = data.statusMessage;
				 $scope.bills = data.results;
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
			
		});
		
	}
	$scope.showBillDetail = function(value) {
		$scope.billvalues = value;
		$scope.showBillModal = !$scope.showBillModal;
	}
	
	$scope.deliverydetails = function() {
		var area =document.getElementById("inputarea").value;
		$scope.showRevenue = true;
		$scope.smr = true;
		$scope.showMap = false;
		$http({
			method : "POST",
			url : 'http://localhost:3000/fetchDeliveryDetails',
			data : {
				"area":area,
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.showMap= true;
				$scope.smd = false;
				$scope.statusMessageDelivery = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.showMap= true;
				$scope.smd = false;
				$scope.statusMessageDelivery = data.statusMessage;
			}
			else
				{
				$scope.showMap= false;
				 $scope.bills = data.results;
				 $scope.statusMessageDelivery = data.statusMessage;
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
			
		});
		
	}
	$scope.showDeliveryDetail = function(value) {
		$scope.billvalues = value;
		$scope.showDeliveryModal = !$scope.showDeliveryModal;
	}
	
	$scope.viewproducts = function(){
		$state.transitionTo("viewProducts");
	}
	
	$scope.viewproductsinfo = function(){
		$scope.listofproducts = false;
		$scope.showMap = true;
		$scope.limitproductinfo=10;
		$scope.hidep =false;
		$http({
			method : "GET",
			url : 'http://localhost:3000/listAllProductsForAdmin',
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.hidep =true;
				$scope.listofproducts = true;
				$scope.statusMessage = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.hidep =true;
				$scope.listofproducts = true;
				$scope.statusMessage = data.statusMessage;
			}
			else
				{
				 $scope.products = data.results;
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
			
		});
	}
	
	  $scope.loadmoreproductinfo=function(){
			var increamented = $scope.limitproductinfo + 10;
			$scope.limitproductinfo = increamented >$scope.products.length ? $scope.products.length : increamented;
		}
	  
	  $scope.showProductDetail = function(product_id){
		  $http({
				method : "POST",
				url : 'http://localhost:3000/viewProduct',
				data:{
					"productId":product_id
				}
			}).success(function(data) {
				
				if (data.statusCode == 403) {
					$scope.showMap = true;
					$scope.statusMessageProductInfo = data.statusMessage;
				}
				else if (data.statusCode == 401) {
					$scope.showMap = true;
					$scope.statusMessageProductInfo = data.statusMessage;
				}
				else
					{
					
					$scope.showMap = false;
					$scope.product = data.sqlResult[0];			
						}
			}).error(function(error) {
				
				
			});
	  }
	
	$scope.viewcustomernames = function() {
		$scope.customernames = false;
		//var area =document.getElementById("inputarea").value;
		$scope.limit=10;
		$http({
			method : "GET",
			url : 'http://localhost:3000/listAllCustomers',
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.customernames = true;
				$scope.statusMessage = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.customernames = true;
				$scope.statusMessage = data.statusMessage;
			}
			else
				{
				 $scope.customers = data.results;
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
			
		});
		
	}
	
    $scope.loadmore=function(){
		var increamented = $scope.limit + 10;
		$scope.limit = increamented >$scope.customers.length ? $scope.customers.length : increamented;
	}
 
	$scope.showCustomerDetail = function(customer_id) {
	
		$scope.showMap= false;
		$http({
			method : "POST",
			url : 'http://localhost:3000/fetchCustomerDetails',
			data : {
				"customerId":customer_id,
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.showMap= true;
				$scope.statusMessageCustomerBill = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.showMap= true;
				$scope.statusMessageCustomerBill = data.statusMessage;
			}
			else
				{
				$scope.showMap= false;
				 $scope.bills = data.results;
				}
		}).error(function(error) {
			$scope.statusMessageCustomerBill = data.statusMessage;
			
		});
		
	}
	$scope.showCustomerFullDetail = function(value) {
		$scope.billvalues = value;
		$scope.showCustomerModal = !$scope.showCustomerModal;
	}
	
	$scope.revenue = function() {
		var to =document.getElementById("inputtodate").value;
		var from =document.getElementById("inputfromdate").value;
		var d1 = new Date(to);
		var d2 = new Date(from);
		$scope.showRevenue = false;	
		$scope.smd = true;
		$scope.showMap = true;
		if(daydiff(d1, d2)!=7){
			$scope.showRevenue= true;
			$scope.smr = false;
			$scope.statusMessageRevenue = "Please enter proper dates!"
			return;
		}
		$http({
			method : "POST",
			url : 'http://localhost:3000/fetchStatisticsData',
			data : {
				"to":to,
				"from":from
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.showRevenue= true;
				$scope.smr = false;
				$scope.statusMessageRevenue = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.showRevenue= true;
				$scope.smr = false;
				$scope.statusMessageRevenue = data.statusMessage;
			}
			else
				{
				$scope.showRevenue= false;
				$scope.statusMessageRevenue = data.statusMessage;
				 // Load the Visualization API and the corechart package.
			      google.charts.load('current', {'packages':['corechart']});

			      // Set a callback to run when the Google Visualization API is loaded.
			      google.charts.setOnLoadCallback(drawChart);

			      // Callback that creates and populates a data table,
			      // instantiates the pie chart, passes in the data and
			      // draws it.
			      function drawChart() {

			        // Create the data table.
			        var data1 = google.visualization.arrayToDataTable(data.results);

			        // Set chart options
			        var options = {
			        hAxis: {
			          title: 'Date',
			          minValue: 0
			        },
			        vAxis: {
			          title: 'Revenue'
			        }
			      };

			        // Instantiate and draw our chart, passing in some options.
			        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
			        chart.draw(data1, options);
			      }
				 
				$scope.showRevenue= false;
				
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
			
		});
		
	}
	function daydiff(first, second) {
	    return Math.round((second.getTime() - first.getTime())/(1000*60*60*24));
	}
});