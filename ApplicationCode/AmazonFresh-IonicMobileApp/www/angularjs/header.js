amazonfresh.controller('header', function($scope, $http, $state, $rootScope) {
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
	$scope.deleteaccount = function() {
		$http({
			method : "POST",
			url : 'http://localhost:3000/deleteAccount',
			data:
			{
			"category":"farmer"
			}
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

});