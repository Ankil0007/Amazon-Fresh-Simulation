amazonfresh.controller('login', function($scope, $http, $state,$rootScope) {
	$scope.invalid_login = true;
	
	$rootScope.category="";
	$scope.login = function() {
		var category = "";
		if(document.getElementById("catcustomer").checked){
			category = document.getElementById("catcustomer").value;
		}
		else if(document.getElementById("catfarmer").checked){
			category = document.getElementById("catfarmer").value;
		}
		$http({
			method : "POST",
			url : 'http://localhost:3000/afterLogin',
			data : {
				"email" : $scope.email,
				"password" : $scope.password,
				"category" :category
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
		
				$scope.invalid_login = false;
				$scope.statusMessage = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.statusMessage = data.statusMessage;
			}
			else
				{
				if(category=="farmer"){

				 $state.transitionTo('farmerHome');
				}
				else{
					$state.transitionTo('customersuccessful');
				}
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
	$scope.signupCustomer = function() {
		$state.transitionTo('customersignup');
		$rootScope.category="customer";
	};
	$scope.signupFarmer = function() {
		$state.transitionTo('farmersignup');
		$rootScope.category="farmer";
	};
	$scope.adminLogin = function() {
		$state.transitionTo('adminlogin');
		$rootScope.category="admin";
	};
	
	$scope.adminLoginSubmit = function() {
		$http({
			method : "POST",
			url : 'http://localhost:3000/afterAdminLogin',
			data : {
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 403) {
				$scope.invalid_login = false;
				$scope.statusMessage = data.statusMessage;
				
			}
			else if (data.statusCode == 401) {
				$scope.invalid_login = true;
				$scope.statusMessage = data.statusMessage;
			}
			else
				{
				 $state.transitionTo('adminsuccessful');
				}
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
	
	
});


