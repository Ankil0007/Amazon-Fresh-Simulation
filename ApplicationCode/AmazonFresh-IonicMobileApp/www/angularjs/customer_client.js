/*amazonfresh.controller('header', function($scope, $http,$rootScope,$state) {
	$scope.listAllProducts = listAllProducts($scope, $http,$rootScope,$state);
});*/
var qtyList = [{"qtyVal":1},{"qtyVal":2},{"qtyVal":3},{"qtyVal":4},{"qtyVal":5},{"qtyVal":6},{"qtyVal":7},{"qtyVal":8},{"qtyVal":9},{"qtyVal":10},{"qtyVal":11},{"qtyVal":12},{"qtyVal":13},{"qtyVal":14},{"qtyVal":15},{"qtyVal":16},{"qtyVal":17},{"qtyVal":18},{"qtyVal":19},{"qtyVal":20},{"qtyVal":21},{"qtyVal":22},{"qtyVal":23},{"qtyVal":24},{"qtyVal":25},{"qtyVal":26},{"qtyVal":27},{"qtyVal":28},{"qtyVal":29},{"qtyVal":30}]; 
	//[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];

amazonfresh.filter('twoDecimal', function ($filter) {
    return function (input) {
        if (isNaN(input)) return input;
        return Math.round(input * 100) / 100;
    };
});

amazonfresh.service('purchaseHistoryService', function() {
	  var billDetails = [];

	  var clearBillDetails = function(){
		  billDetails=[];
	  }
	  
	  var addBillDetails = function(newObj) {
		  billDetails.push(newObj);
	  };

	  var getBillDetails = function(){
	      return billDetails;
	  };

	  return {
		  addBillDetails: addBillDetails,
		  getBillDetails: getBillDetails,
		  clearBillDetails:clearBillDetails
	  };

	});

	function listAllProducts($scope,$http,$rootScope,$state) 
	{
		$http({
			method : "GET",
			url : 'http://localhost:3000/listAllProducts',
		}).success(function(data) {
			if (data.statusCode == 401 || data.statusCode == 403){
				$scope.error_message=false;
				$scope.status_message = data.statusMessage;
			}
			else if(data.statusCode == 200)
			{
				$scope.products=data.mongoResult;
				//$state.transitionTo("customerHomepage");
			}
			else
			{
				$scope.error_message=false;
				$scope.status_message = data.statusMessage;
			}
		}).error(function(error) {
			$scope.error_message=false;
			$scope.status_message = error.statusMessage;
		});
	}

	function viewProduct(productId,$scope,$http,$rootScope,$state,$timeout)
	{
			$http({
				method : "POST",
				url : 'http://localhost:3000/viewProduct',
				data : {
					"productId" : productId,
				}
			}).success(function(data) {
				//alert(JSON.stringify(data.mongoResult[0].product_id));
				if (data.statusCode == 401 || data.statusCode == 403){
						$scope.status_message=data.statusMessage;
						$scope.error_message=false;
				}
				else if(data.statusCode == 200)
				{
					/*$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
						alert("done");
						//alert($('#rating_field').attr("id"));
						$('#rating_field').val(data.mongoResult.reviews[0].rating);
						$('#rating_field').rating();
					});*/
					$scope.onEnd = function(){
		                $timeout(function(){
		                	$(".rating1").each(function()
                			{
								$('#'+$(this).attr("id")).rating();
                			});
		                	$(".videoHiddenInput").each(function()
                			{
								$('#'+$(this).attr("id")+"_show").attr("src",$(this).val());
                			});
		                }, 1);
		            };
		            //alert(JSON.stringify(data.mongoResult[0].updatedproduct_price));
					$state.transitionTo('customersuccessful.viewproduct');
					$scope.qtyArray1=qtyList;
					$scope.product_name=data.sqlResult[0].product_name;
					$scope.photo=data.mongoResult[0].image;
					$scope.farmer_id=data.mongoResult[0].farmer_id;
					$scope.updatedproduct_price=data.mongoResult[0].updatedproduct_price;
					$scope.product_id=data.mongoResult[0].product_id;
					//$scope.rating=data.mongoResult.reviews[0].rating;
					$scope.quantity=qtyList[0];
					$scope.reviews = data.mongoResult[0].reviews;
				}
			}).error(function(error) {
				$scope.error_message=false;
				$scope.status_message=error.statusMessage;
			});
	}
	
	amazonfresh.directive('repeatEnd', function ($timeout) {
	    return {
	    	restrict: "A",
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    scope.$eval(attrs.repeatEnd);
                }
            }
	    }
	});
	
	/*amazonfresh.directive('billRepeatEnd', function ($timeout) {
	    return {
	    	restrict: "A",
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    scope.$eval(attrs.billRepeatEnd);
                }
            }
	    }
	});*/
	
	function modifyProductName(p)
	{
		if(p.length>=12)
		{
			return p.substring(0,8)+"...";
		}
		return p;
	}
	
	function calculateTotal($scope)
	{
		var total=0;
		var cart=localStorage.getItem("cart");
		if(!isCartEmpty())
		{
			cart = JSON.parse(cart);
			//cart = JSON.parse(cart);
			var all_products = combineAllProducts(cart["farmerWiseProducts"]);
			$scope.cart1 = all_products;
			for(var i=0; i<all_products.length;i++)
			{
				var prod = all_products[i];
				var qty1 = prod.product_quantity;
				if(typeof qty1 == "undefined" || qty1 == null)
				{
					qty1=1;
				}
				total = Number(Number(total) + Number(qty1*prod.product_price));
			}
		}
		return total.toFixed(2);
	}
	
	/*function updateProduct(prodArray,product_id,product_price,product_quantity)
	{
		prodArray.push()
	}*/
	
	function addToCart(productId,productName,farmerId,$scope,$http,$rootScope,$state)
	{
		var productPrice = $("#price_"+productId).val();
		//alert(productPrice);
		var farmerWiseProdArr = new Array();
		var q;
		productName = modifyProductName(productName);
		var cart=localStorage.getItem("cart");
		if(typeof $scope.quantity == 'undefined' || $scope.quantity==null)
		{
			q=1;
		}
		else
		{
			q=Number($scope.quantity.qtyVal);
		}
		if(!isCartEmpty())
		{
				cart = JSON.parse(cart);
				var farmerExist = 0,prodExist=0;
				var farmerWiseProducts = cart["farmerWiseProducts"];
				for(var c=0;c<farmerWiseProducts.length;c++)
				{
					var e = farmerWiseProducts[c]; //farmer
					if(e.farmer_id==farmerId)
					{
						farmerExist=1;
						var prodArray = e.products;
						for(var k=0;k<prodArray.length;k++)
						{
							if(prodArray[k].product_id==productId)
							{
								prodExist=1;
								prodArray[k].product_quantity=Number(prodArray[k].product_quantity)+1;
								prodArray[k].product_price=productPrice;
								break;
							}
						}
						if(prodExist==0)
						{
							//alert(q);
							prodArray[prodArray.length]={product_id:productId,product_name:productName,product_price:productPrice,product_quantity:q};
						}
						e.products =prodArray;
						farmerWiseProducts[c]=e;
					}
				}
				if(farmerExist==0)
				{
					//cart = JSON.parse(cart);
					var total = Number(q)*Number(productPrice);
					var json = {products:[{product_id:productId,product_quantity:q,product_name:productName,product_price:productPrice}],farmer_id:farmerId,total_price:total};
					cart.farmerWiseProducts.push(json);
				}
		}
		else
		{
			var total = Number(q)*Number(productPrice);
			var json = {products:[{product_id:productId,product_quantity:q,product_name:productName,product_price:productPrice}],farmer_id:farmerId,total_price:total};
			farmerWiseProdArr.push(json);
			cart = {"farmerWiseProducts":farmerWiseProdArr};
		}
		//alert(JSON.stringify(cart));
		localStorage.setItem("cart",JSON.stringify(cart));
		$scope.loadCart();
		alert("Item added successfully");
	}
	
	/*function calculateTotalPriceForFarmer(products)
	{
		for(var i=0;i<products.length;i++)
		{
			parseInt(products[0].product_quantity)
		}
	}*/
	
	function updateQty(productId,newQty,$scope)
	{
		var cart = localStorage.getItem("cart");
		cart = JSON.parse(cart);
		var farmerWiseProducts = cart["farmerWiseProducts"];
		var prodFound=0;
		for(var i=0; i<farmerWiseProducts.length;i++)
		{
			var prodArr = farmerWiseProducts[i].products;
			for(var j=0;j<prodArr.length;j++)
			{
				if(prodArr[j].product_id==productId)
				{
					prodFound=1;
					prodArr[j].product_quantity=Number(newQty);
					break;
				}
			}
			if(prodFound==1)
			{
				farmerWiseProducts[i].products=prodArr;
				break;
			}
		}
		var newcart = {"farmerWiseProducts":farmerWiseProducts}
		localStorage.setItem("cart",JSON.stringify(cart));
		$scope.loadCart();
	}
	
	function updateFarmerWisePrice()
	{
		var cart = localStorage.getItem("cart");
		cart = JSON.parse(cart);
		var farmerWiseProducts = cart["farmerWiseProducts"];
		var prodFound=0;
		for(var i=0; i<farmerWiseProducts.length;i++)
		{
			var prodArr = farmerWiseProducts[i].products;
			var farmerWisetotalPrice=0;
			for(var j=0;j<prodArr.length;j++)
			{
				farmerWisetotalPrice = farmerWisetotalPrice + Number(prodArr[j].product_quantity)*Number(prodArr[j].product_price);
			}
			farmerWiseProducts[i].total_price=farmerWisetotalPrice;
			/*if(prodFound==1)
			{
				farmerWiseProducts[i].products=prodArr;
				break;
			}*/
		}
		var newcart = {"farmerWiseProducts":farmerWiseProducts}
		localStorage.setItem("cart",JSON.stringify(cart));
	}
	
	function deleteFromCart(productId,$scope)
	{
		var cart = localStorage.getItem("cart");
		cart = JSON.parse(cart);
		var farmers = cart["farmerWiseProducts"];
		var new_items = [];
		var j=0;
		//$scope.cart = all_items;
		for(var i=0; i<farmers.length;i++)
		{
			var prodArr = farmers[i].products;
			var newProdArr = [],m=0;
			for(var k=0;k<prodArr.length;k++)
			{
				if(prodArr[k].product_id==productId)
				{
					continue;
				}
				newProdArr[m++]=prodArr[k];
			}
			farmers[i].products=newProdArr;
		}
		cart = {"farmerWiseProducts":farmers};
		localStorage.setItem("cart",JSON.stringify(cart));
		$scope.loadCart();
	}

	amazonfresh.controller('customer', function($scope, $http,$rootScope,$state,$parse,$timeout) 
	{
		$scope.farmerdetailsmodal=false;
		$rootScope.cardno="";
		$rootScope.placeOrder="";
		$rootScope.cardholdername="";
		$rootScope.expirationmonth="";
		$rootScope.expirationyear="";
		$rootScope.streetaddress="";
		$rootScope.optionaladdress="";
		$rootScope.city="";
		$rootScope.state="";
		$rootScope.zipcode="";
		$rootScope.phone="";
		$rootScope.payment_error_message=true;
		$rootScope.payment_status_message=true;
		$rootScope.orderId="";
		
		$scope.error_message = true;
		$scope.customer_error_message=true;
		$scope.cc=true;
		$scope.error_message=true;
		$scope.view_product_div=false;
		
		
		$scope.loadMorebtn=true;
		$scope.limit = 8;
		
		$scope.loadMoreProducts=function(){
			var incremented = $scope.limit + 8;
			$scope.limit = incremented > $scope.products.length ? $scope.products.length : incremented;
		}
		
		$scope.listAllProducts = function()
		{
			$scope.place_order_page=true;
			$scope.customer_page=false;
			listAllProducts($scope, $http,$rootScope,$state);
			$scope.loadMorebtn=false;
		}
		$scope.viewProduct = function(productId)
		{
			$scope.place_order_page=true;
			$scope.customer_page=false;
			viewProduct(productId,$scope,$http,$rootScope,$state,$timeout);
		};
		$scope.visitFarmerFromViewProduct = function(farmerId)
		{
			$http({
				method : "POST",
				url : 'http://localhost:3000/fetchFarmerDetails',
				data:
					{
					"farmerId":farmerId
					}
			}).success(function(data) {
				if (data.statusCode == 403) {
					alert(data.statusMessage);
				}
				else if (data.statusCode == 401) {
					alert(data.statusMessage);
				}
				else
					{
					//$scope.farmerinfo = false;
					$scope.farmerdescription = data.mongoResult;
					document.getElementById("profilevideo").src = data.mongoResult.video;
					$scope.farmerdetails = data.sqlResult[0];
					//$("#farmerModal").show();
					$scope.farmerdetailsmodal=!$scope.farmerdetailsmodal;
					}
			}).error(function(error) {
			});
		}
		$scope.addToCart = function (productId,productName,farmerId)
		{
			addToCart(productId,productName,farmerId,$scope,$http,$rootScope,$state);
		};
		$scope.loadCart = function()
		{
			//alert("s"+$scope.quantity11);
			$scope.noDataDiv = true;
			$scope.dataDiv = false;
			$scope.qtyArray = {};
			$scope.qtyArray1 = qtyList;
			var cart = localStorage.getItem("cart");
			//cart = JSON.parse(cart);
			//cart = JSON.parse(cart);
			if(!isCartEmpty())
			{
				updateFarmerWisePrice();
				cart = JSON.parse(cart);
				//alert(cart.farmerWiseProducts);
				if(cart["farmerWiseProducts"].length==0)
				{
					$scope.noDataDiv = false;
					$scope.dataDiv = true;
				}
				else
				{
					var all_products = combineAllProducts(cart["farmerWiseProducts"]);
					//alert(JSON.stringify(all_products));
					$scope.cart1 = all_products;
					//alert(JSON.stringify(cart));
					for(var i=0; i<all_products.length;i++)
					{
						var prod = all_products[i];
						var qty1 = prod.product_quantity;
						if(typeof qty1 == "undefined" || qty1 == null)
						{
							qty1=1;
						}
						$scope.qtyArray[prod.product_id]=qtyList[qty1-1];
					}
					//alert("completed");
					$scope.total = calculateTotal($scope);
				}
			}
			else
			{
				$scope.noDataDiv = false;
				$scope.dataDiv = true;
			}
			
		}
		$scope.updateQty = function(productId,selectObj)
		{
			updateQty(productId,selectObj.qtyVal,$scope);
		}
		$scope.deleteFromCart = function(productId)
		{
			deleteFromCart(productId,$scope);
		}
		$scope.searchProduct = function()
		{
			searchProduct($scope,$http,$state);
		}
		$scope.checkout = function()
		{
			 checkout($scope,$http,$state,$rootScope,$timeout);
		}
		$scope.togglePayment = function(type)
		{
			if(type=='cc')
			{
				$scope.cc=false;
			}
			else
			{
				$scope.cc=true;
			}
		};
		$rootScope.placeOrder = function()
		{
			placeOrder($scope,$http,$state,$rootScope);
		}
	});
	
	function combineAllProducts(farmerWiseProducts)
	{
		var allProducts=[];
		var j=0;
		//alert("inside combine all length123 "+farmerWiseProducts.length);
		for(var i=0;i<farmerWiseProducts.length;i++)
		{
			//alert("products "+JSON.stringify(farmerWiseProducts[i]));
			var prodArr = farmerWiseProducts[i]["products"];
			for(var k=0;k<prodArr.length;k++)
			{
				allProducts[j++]=prodArr[k];
			}
		}
		return allProducts;
	}
	
	amazonfresh.controller('customerheader',function($http,$scope,$rootScope,$state,purchaseHistoryService)
	{
		$rootScope.purchase_history_div=true;
		$scope.fetchPurchaseHistory = function()
		{
			$http({
				method : "POST",
				url : 'http://localhost:3000/fetchDeliveryDetailsForCustomer',
				data : {
					"category" : "customer",
				}
			}).success(function(data) {
				if (data.statusCode == 401 || data.statusCode == 403) {
					$rootScope.purchase_history_message=data.statusMessage;
					$rootScope.purchase_history_div=false;
				}
				else
				{
					//alert(JSON.stringify(data.results));
					purchaseHistoryService.clearBillDetails();
					purchaseHistoryService.addBillDetails(data.results);
					$state.transitionTo('purchasehistory');
				}
			}).error(function(error) {
				$scope.unexpected_error = false;
			});
		}
	});
	
	amazonfresh.controller('paymenthistory',function($scope,$rootScope,$state,purchaseHistoryService,$http,$timeout)
	{
		$scope.showProductReviewModal = false;
		$scope.loadBillData = function(){
			$scope.bills=purchaseHistoryService.getBillDetails();
			//alert(JSON.stringify(purchaseHistoryService.getBillDetails()));
            };
            $scope.onBillEnd = function(){
                $timeout(function(){
                	$(".map_class").each(function()
        			{
                		var billId = $(this).attr('id').substring(0,$(this).attr('id').indexOf("_"));
                		loadMap($("#"+billId+"_lat").val(),$("#"+billId+"_lon").val(),$(this).attr("id"));
        			});
            }, 1);
			/*$scope.onBillEnd = function(){
                $timeout(function(){
                	$(".map_class").each(function()
        			{
                		var billId = substring(0,$(this).attr('id').indexOf("_"));
                		alert(billId);
                		loadMap($("#"+billId+"_lat").val(),$("#"+billId+"_lon").val(),$(this).attr("id"));
        			});
                }, 1);
            };*/
			//$scope.showBillModal = true;
		}
		$scope.showBillDetail = function(value,billId) {
			$scope.billvalues = value;
			$scope.showBillModal = !$scope.showBillModal;
			//var lat = $("#"+billId+"_Lat").val();
			var lat = "42.11";
			var lon = "-88.22";
			//var lon = $("#"+billId+"_Lon").val();
			//loadMap(lat,lon);
		}
		$scope.reviewProduct = function(productId)
		{
			$scope.showBillModal = false;
			$("#productReviewId").val(productId);
			$('#showProductReviewDiv').modal('toggle');
		}
		$scope.submitReview = function()
		{
			var productId = $("#productReviewId").val();
			/*alert("\n Video 123"+$("#hiddenReviewVideo").val()+
					"Rate "+$("#reviewRating").val()+
					$("#description").val());*/
			$http({
				method : "POST",
				url : 'http://localhost:3000/addReview',
				data : {
					"productId" : productId,
					"image":$("#hiddenReviewPic").val(),
					"video":$("#hiddenReviewVideo").val(),
					"rating":$("#reviewRating").val(),
					"review":$("#description").val()
				}
			}).success(function(data) {
				if (data.statusCode == 401 || data.statusCode == 403) {
					$scope.error_message = false;
					$scope.status_message=data.statusMessage;
				}
				else
				{
					$('#showProductReviewDiv').modal('toggle');
				}
			}).error(function(error) {
				$scope.unexpected_error = false;
				//$scope.invalid_login = true;
			});
		}
	});
	
	function searchProduct($scope,$http,$state)
	{
		$scope.error_message=true;
		if(typeof $scope.searchString != "undefined" && $scope.searchString!=null && $scope.searchString!="")
		{
			$http({
				method : "POST",
				url : 'http://localhost:3000/searchProduct',
				data : {
					"searchString" : $scope.searchString,
				}
			}).success(function(data) {
				//alert(JSON.stringify(data.mongoResult.length));
				if (data.statusCode == 401 || data.statusCode == 403) {
					$scope.error_message = false;
					$scope.status_message=data.statusMessage;
				}
				else
				{
					$state.transitionTo('customersuccessful.searchproduct');
					if(data.mongoResult.length==0)
					{
						$scope.error_message=false;
						$scope.status_message="No products found for the given search criteria.";
						$scope.products=null;
					}
					else
						$scope.products=data.mongoResult;
				}
			}).error(function(error) {
				$scope.unexpected_error = false;
				//$scope.invalid_login = true;
			});
		}
	}
	
	function checkout($scope,$http,$state,$rootScope,$timeout)
	{
		var cart = localStorage.getItem("cart");
		if(!isCartEmpty())
		{
			//cart = JSON.parse(cart);
			$http({
				method : "POST",
				url : 'http://localhost:3000/checkout'
				/*data: {cart:cart}*/
			}).success(function(data) {
				if (data.statusCode == 401 || data.statusCode == 403) {
					$scope.error_message=false;
					$scope.status_message=data.statusMessage;
				}
				else
				{
					$state.transitionTo('payment');
					$rootScope.$on('$stateChangeSuccess', function (event) {
						//alert($('#rating_field').attr("id"));
						$rootScope.cardno=data.results[0].credit_card_no;
						$rootScope.cardholdername=data.results[0].card_holder_name;
						$rootScope.expirationmonth=data.results[0].expiration_month;
						$rootScope.expirationyear=data.results[0].expiration_year;
						$rootScope.streetaddress=data.results[0].address;
						//$rootScope.optionaladdress=data.results[0].optionaladdress;
						$rootScope.city=data.results[0].city;
						$rootScope.state=data.results[0].state;
						$rootScope.zipcode=data.results[0].zip_code;
						$rootScope.phone=data.results[0].phone_number;
					});
				}
			}).error(function(error) {
				$scope.unexpected_error = false;
				//$scope.invalid_login = true;
			});
		}
		else
		{
			$scope.customer_error_message = false;
			$scope.customer_status_message="Your cart is Empty. Please add atleast one product to proceed further";
		}
	}

	function isCartEmpty()
	{
		var cart = localStorage.getItem("cart");
		if(typeof cart != "undefined" && cart!=null && cart!="")
		{
			cart = JSON.parse(cart);
			var farmerWiseProducts = cart["farmerWiseProducts"];
			var allProdEmpty=true;
			for(var i=0;i<farmerWiseProducts.length;i++)
			{
				var prodArr = farmerWiseProducts[i].products;
				if(typeof prodArr=='undefined' || prodArr==null || prodArr=='' || prodArr.length==0)
				{
					
				}
				else
					allProdEmpty=false;
			}
			return allProdEmpty;
		}
		return true;
	}
	
	function placeOrder($scope,$http,$state,$rootScope)
	{
		var cart = localStorage.getItem("cart");
		if(!isCartEmpty())
		{
			cart = JSON.parse(cart);
			$http({
				method : "POST",
				url : 'http://localhost:3000/placeOrder',
				data : {cart:cart,dropofflocation:$scope.streetaddress+" "+$scope.city+" "+$scope.state+" "+$scope.zipcode+" "+$scope.phone}
			}).success(function(data) {
				if (data.statusCode == 401 || data.statusCode == 403) {
					$rootScope.payment_error_message=false;
					$rootScope.payment_status_message=data.statusMessage;
				}
				else
				{
					localStorage.removeItem("cart");
					$state.transitionTo('paymentconfirmation');
					/*$rootScope.$on('$stateChangeSuccess', function (event) {
						$rootScope.orderId=data.orderId;
					});*/
				}
			}).error(function(error) {
				$scope.unexpected_error = false;
				//$scope.invalid_login = true;
			});
		}
		else
		{
			$scope.payment_error_message = false;
			$scope.payment_status_message="Your cart is Empty. Please add atleast one product to proceed further";
		}
	}
