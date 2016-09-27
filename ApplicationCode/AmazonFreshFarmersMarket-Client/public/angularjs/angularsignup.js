amazonfresh.controller('signup', function($scope, $http,$rootScope,$state,$location) {
	$scope.next = function() {

		if ($scope.email != $scope.verifyemail) {
			$scope.IsMatchEmail=true;
			return false;
		}
		$scope.IsMatchEmail=false;
		if ($scope.password != $scope.verifypassword) 
		{
			$scope.IsMatchPassword=true;
			return false;
		}
		$scope.IsMatchPassword=false;
	
		$http({
			method : "POST",
			url : '/createAccount',
			data : {
				"firstName" : $scope.firstName,
				"lastName" : $scope.lastName,
				"email" : $scope.email,
				"password" : $scope.password,
				"category" : $rootScope.category
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				$scope.statusMessage = data.statusMessage;
				
			}
			else if(data.statusCode == "403"){
			
				$scope.IsRegisteredEmail=true;
				return false;
				//$scope.statusMessage = data.statusMessage;
			}
			else
				{
			
				if(typeof $rootScope.category == "undefined"){ 
					var url = $location.absUrl();
					var parturl = url.split('/');
					if(parturl[parturl.length-1]=="enterCustomerBasicInfo"){
						$rootScope.category = "customer";
					}
					else{
						$rootScope.category = "farmer";
					}
					}
			
				if($rootScope.category == "customer")
				{
				$state.transitionTo("customeraddressDetails");
				}
				else{
					
					$state.transitionTo("farmeraddressDetails");
				}
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
		});
	};

	$scope.nextsplashdelivery = function() {

		var location = $scope.streetaddress + ","+ $scope.city + "," +document.getElementById("state").value+"-"+$scope.zipcode;
		   
		var geocoder = new google.maps.Geocoder();
		
        geocoder.geocode( { 'address': $scope.zipcode}, function(results, status) {
       
        	 if (status == google.maps.GeocoderStatus.OK) {
        		 	
		$http({
			method : "POST",
			url : '/saveAddress',
			data : {
				"streetAddress" : $scope.streetaddress,
				"city" : $scope.city,
				"state" : document.getElementById("state").value,
				"zipCode" : $scope.zipcode,
				"phoneNumber" : $scope.phone,
				"location":location,
				"location_lat":results[0].geometry.location.lat(),
				"location_lng":results[0].geometry.location.lng()
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			}
			else
			{
	
				if(typeof $rootScope.category == "undefined"){ 
				var url = $location.absUrl();
				var parturl = url.split('/');
				if(parturl[parturl.length-1]=="customerAddress"){
					$rootScope.category = "customer";
				}
				else{
					$rootScope.category = "farmer";
				}
				}
		
				if($rootScope.category=='farmer')
				{
					$state.transitionTo('farmerdescription');
				}
				else if($rootScope.category=='customer')
					$state.transitionTo("cardDetails");
			}
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
        }
        	 else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){ 
        	        $scope.invalidAddress = true;        	    
        	      }
        	      else{
        	        alert("Geocode was not successful for the following reason: " + status);
        	   
        	      }
		 });
		
	};

	$scope.finalsignup = function() {
	
		$http({
			method : "POST",
			url : '/saveCardDetails',
			data : {
				"cardNumber" : $scope.cardno,
				"cardHolderName" : $scope.cardholdername,
				"cardExpirationMonth" : $scope.expirationmonth,
				"cardExpirationYear" : $scope.expirationyear
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			}
			else
			{
		
				$state.transitionTo('pendingApproval');
			}
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
	
	$scope.farmerhome = function() {

		
		
			$http({
			method : "POST",
			url : '/saveFarmerDescription',
			data : {
				"description" : document.getElementById("description").value,
				"image" : document.getElementById("hiddenimage").value,
				"video" : document.getElementById("hiddenvideo").value,	
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
			}
			else
			{
				$state.transitionTo('pendingApproval');
			}
		}).error(function(error) {
			
		});
	};
})
