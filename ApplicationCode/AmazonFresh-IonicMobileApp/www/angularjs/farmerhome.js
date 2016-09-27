amazonfresh.controller('farmer', function($scope, $http, $state, $rootScope) {
	
	$scope.loadDetails = function() {
		$http({
			method : "POST",
			url : 'http://localhost:3000/fetchFarmerDetails',
		}).success(function(data) {
			
			if (data.statusCode == 403) {
			}
			else if (data.statusCode == 401) {
			}
			else
				{
				$scope.farmerdescription = data.mongoResult;
				document.getElementById("profilevideo").src = data.mongoResult.video;
				$scope.farmerdetails = data.sqlResult[0];
				}
		}).error(function(error) {
			
			
		});
	}
	$scope.editProfile = function() {
		$scope.showProfile = !$scope.showProfile;
		$scope.firstName = $scope.farmerdetails.firstname;
		$scope.lastName = $scope.farmerdetails.lastname;
		$scope.address = $scope.farmerdetails.address;
		$scope.city = $scope.farmerdetails.city;
		$scope.state = $scope.farmerdetails.state;
		$scope.zipCode = $scope.farmerdetails.zip_code;
		$scope.phoneNumber = $scope.farmerdetails.phone_number;
		$scope.email = $scope.farmerdetails.email;
		$scope.description = $scope.farmerdescription.description;	
		$scope.image = $scope.farmerdescription.image;	
		document.getElementById("editprofilevideo").src=$scope.farmerdescription.video;
	}
	
	$scope.savechanges = function() {
		
		$http({

			method : "POST",
			url : 'http://localhost:3000/amendFarmerDetails',
			data:{
				"firstName":document.getElementById("firstName").value,
				"lastName":document.getElementById("lastName").value,
				"address":document.getElementById("address").value,
				"city":document.getElementById("city").value,
				"state":document.getElementById("state").value,
				"zipCode":document.getElementById("zipCode").value,
				"phoneNumber":document.getElementById("phoneNumber").value,
				"description":document.getElementById("description").value,
				"image":document.getElementById("editprofilepic").src,
				"video":document.getElementById("editprofilevideo").src
			}
		}).success(function(data) {
			
			if (data.statusCode == 403) {
			}
			else if (data.statusCode == 401) {
			}
			else
				{
				$scope.showProfile = !$scope.showProfile;
				$scope.loadDetails();
				
				}
		}).error(function(error) {
			
			
		});
	}
	
	
$scope.loadProductDetails = function() {
	
		$http({
			method : "GET",
			url : 'http://localhost:3000/listProducts'
		}).success(function(data) {
			
			if (data.statusCode == 403) {
				$scope.statusMessage = data.statusMessage;
			}
			else if (data.statusCode == 401) {
				$scope.statusMessage = data.statusMessage;
			}
			else
				{
				$scope.productslist = data.results;
				
				}
		}).error(function(error) {
			$scope.statusMessage = data.statusMessage;
			
		});
	}

$scope.editProduct = function(product_id) {

	$http({
		method : "POST",
		url : 'http://localhost:3000/viewProductForFarmer',
		data:{
			"productId":product_id
		}
	}).success(function(data) {
		
		if (data.statusCode == 403) {
		$scope.statusMessage = data.statusMessage;
		}
		else if (data.statusCode == 401) {
			$scope.statusMessage = data.statusMessage;
		}
		else
			{
			
			$scope.statusMessage = data.statusMessage;
			$scope.showProduct = !$scope.showProduct;

			$scope.product = data.sqlResult[0];
				
			$scope.productimage = data.mongoResult.image;
		
			}
	}).error(function(error) {
		
		
	});
}
$scope.displayProduct = function(product_id){
	$http({
		method : "POST",
		url : 'http://localhost:3000/viewProductForFarmer',
		data:{
			"productId":product_id
		}
	}).success(function(data) {
		
		if (data.statusCode == 403) {
		}
		else if (data.statusCode == 401) {
		}
		else
			{
			
			$scope.displayProductInfo = !$scope.displayProductInfo;
			$scope.product = data.sqlResult[0]			
			$scope.productimage = data.mongoResult.image;
			}
	}).error(function(error) {
		
		
	});
}

$scope.saveproductchanges = function(product) {
	
	$http({
		method : "POST",
		url : 'http://localhost:3000/amendProductDetails',
		data:{
			"productId":product.product_id,
			"productName":document.getElementById("proname").value,
			"productDescription":document.getElementById("prodesc").value,
			"productPrice":document.getElementById("proprice").value
		}
	}).success(function(data) {
		
		if (data.statusCode == 403) {
		}
		else if (data.statusCode == 401) {
		}
		else
			{
			$scope.showProduct = !$scope.showProduct;
			$scope.loadProductDetails();
			}
	}).error(function(error) {
		
		
	});
	
}

$scope.deleteProduct = function(product_id) {
	
	if(confirm("Do you want to delete this product!")){

	$http({
		method : "POST",
		url : 'http://localhost:3000/deleteProduct',
		data:{
			"productId":product_id
		}
	}).success(function(data) {
		
		if (data.statusCode == 403) {
		}
		else if (data.statusCode == 401) {
		}
		else
			{
			$scope.loadProductDetails();
			}
	}).error(function(error) {
		
	});
	}
	else{
		
	}
}
$scope.addProduct = function() {
	$scope.addProductModal = !$scope.addProductModal;
}
$scope.addproductdetail = function() {
	
	$http({
		method : "POST",
		url : 'http://localhost:3000/createProduct',
		data:{
			"productName":$scope.product_name,
			"productPrice":$scope.product_price,
			"productDescription":$scope.product_description,
			"productQuantity":$scope.product_quantity,
			"productImage":document.getElementById("hiddenproductimage").value
			
		}
	}).success(function(data) {
		
		if (data.statusCode == 403) {
		}
		else if (data.statusCode == 401) {
		}
		else
			{
			$scope.addProductModal = !$scope.addProductModal;
			$scope.loadProductDetails();
			}
	}).error(function(error) {
		
	});
}

});