var amazonfresh = angular.module('amazonfresh', [ 'ui.router','angular.filter']);

amazonfresh.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

amazonfresh.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$stateProvider.state('login', {	
		url : '/',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
                templateUrl : 'templates/login.html',
            },
		}
	})
	$stateProvider.state('viewFarmers', {	
		url : '/viewFarmers',
		views: {
            'header': {
                templateUrl : 'templates/adminheader.html',
            },
            'content': {
                templateUrl : 'templates/viewfarmers.html',
            },
		}
	})
	.state('customersuccessful',{
		url:'/afterCustomerLogin',
		views: {
            'header': {
                templateUrl : 'templates/customerheader.ejs',
            },
            'content': {
            	templateUrl: 'templates/customer.ejs'
            },
            'products_content@customersuccessful': {
            	templateUrl: 'templates/allproducts.ejs',
            },
            'cart@customersuccessful': {
            	templateUrl: 'templates/cart.ejs',
            },
            'loadMore@customersuccessful' : {
            	template: '<div class="col-md-9"><div class="center"><br/><br/><input type="button" class="loadMoreBtn ff-btn tweet-btn" id="loadMore1" value="Load More" ng-click="loadMoreProducts()"/><br/><br/> </div></div>'
            }
		}
	})
	.state('customersuccessful.viewproduct',{
		url:'/viewProduct',
		parent:'customersuccessful',
		views: {
            'header': {
                templateUrl : 'templates/customerheader.ejs',
            },
            'content': {
            	templateUrl: 'templates/customer.ejs'
            },
            'products_content@customersuccessful': {
            	templateUrl: 'templates/viewproduct.ejs',
            },
            'cart@customersuccessful': {
            	templateUrl: 'templates/cart.ejs',
            }
		}
	})
	.state('customersuccessful.searchproduct',{
		url:'/searchProduct',
		parent:'customersuccessful',
		views: {
            'header': {
                templateUrl : 'templates/customerheader.ejs',
            },
            'content': {
            	templateUrl: 'templates/customer.ejs'
            },
            'products_content@customersuccessful': {
            	templateUrl: 'templates/allproducts.ejs',
            	/*controller:'customer'*/
            },
            'cart@customersuccessful': {
            	templateUrl: 'templates/cart.ejs',
            }
		}
	})
	.state('payment',{
		url:'/checkout',
		views: {
            'header': {
                templateUrl : 'templates/customerheader.ejs',
            },
            'content': {
            	templateUrl: 'templates/payment.ejs'
            },
		}
	})
	.state('paymentconfirmation',{
		url:'/placeOrder',
		views: {
            'header': {
                templateUrl : 'templates/customerheader.ejs',
            },
            'content': {
            	templateUrl: 'templates/paymentconfirmation.ejs'
            },
		}
	})
	.state('purchasehistory',{
		url:'/fetchPurchaseHistory',
		views: {
            'header': {
                templateUrl : 'templates/customerheader.ejs',
            },
            'content': {
            	templateUrl: 'templates/paymenthistory.ejs'
            },
		}
	})
		.state('viewProducts',{
		url:'/viewProducts',
		views: {
            'header': {
                templateUrl : 'templates/adminheader.html',
            },
            'content': {
                templateUrl : 'templates/viewproducts.html',
            },
		}
	})
	.state('adminlogin',{
		url:'/adminLogin',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
                templateUrl : 'templates/adminlogin.html',
            },
		}
	})
	.state('successful',{
		url:'/afterLogin',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
            	template: '<h1>Successfullogin</h1>'
            },
		}
	})
	.state('farmerdescription',{
		url:'/farmerDescription',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
            	 templateUrl : 'templates/farmeradditionaldetails.html',
            },
		}
	})
	.state('adminsuccessful',{
		url:'/afterAdminSignin',
		views: {
            'header': {
                templateUrl : 'templates/adminheader.html',
            },
            'adminhome': {
            	templateUrl: 'templates/adminhome.html'
            },
		}
	})
	.state('ridedetails',{
		url:'/ridesDetails',
		views: {
            'header': {
                templateUrl : 'templates/adminheader.html',
            },
            'ride': {
            	templateUrl: 'templates/ridesearch.html'
            },
		}
	})
	.state('searchbill',{
		url:'/searchBill',
		views: {
            'header': {
                templateUrl : 'templates/adminheader.html',
            },
            'ride': {
            	templateUrl: 'templates/searchbill.html'
            },
		}
	})
	.state('deliverydetails',{
		url:'/deliveryDetails',
		views: {
            'header': {
                templateUrl : 'templates/adminheader.html',
            },
            'ride': {
            	templateUrl: 'templates/deliverydetails.html'
            },
		}
	})
	.state('customerdetails',{
		url:'/customerDetails',
		views: {
            'header': {
                templateUrl : 'templates/adminheader.html',
            },
            'ride': {
            	templateUrl: 'templates/viewcustomers.html'
            },
		}
	})
	.state('customersignup', {
		url:'/enterCustomerBasicInfo',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
                templateUrl : 'templates/createaccount.ejs'
            }
		}
	})
	.state('farmersignup', {
		url:'/enterFarmerBasicInfo',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
                templateUrl : 'templates/createaccount.ejs'
            }
		}
	})
	.state('customeraddressDetails',{
		url:'/customerAddress',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
            	templateUrl : 'templates/splashdelivery.ejs'
            }
		}
	})
	.state('farmeraddressDetails',{
		url:'/farmerAddress',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
            	templateUrl : 'templates/splashdelivery.ejs'
            }
		}
	})
	.state('cardDetails',{
		url:'/customerCardDetails',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
            	templateUrl : 'templates/carddetails.ejs'
            }
		}
		
	})
	.state('customerHomepage',{
		url:'/home',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
            	templateUrl : 'templates/userhomepage.ejs'
            }
		}
	})
	.state('pendingApproval',{
		url:'/pendingApproval',
		views: {
            'header': {
                templateUrl : 'templates/header.ejs',
            },
            'content': {
            	templateUrl : 'templates/pendingapproval.html'
            }
		}
	})
	.state('farmerHome',{
		url:'/farmerHome',
		views: {
            'header': {
                templateUrl : 'templates/farmerheader.html',
            },
            'content': {
            	templateUrl : 'templates/farmerhome.html'
            }
		}
	});
	$urlRouterProvider.otherwise('/');
});
amazonfresh
.directive(
		'modal',
		function() {
			return {
				template : '<div class="modal fade">'
						+ '<div class="modal-dialog">'
						+ '<div class="modal-content">'
						+ '<div class="modal-header">'
						+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
						+ '<h3 class="modal-title">{{ title }}</h3>'
						+ '</div>'
						+ '<div class="modal-body" ng-transclude></div>'
						+ '</div>' + '</div>' + '</div>',
				restrict : 'E',
				transclude : true,
				replace : true,

				scope : true,
				link : function postLink(scope, element, attrs) {
					scope.title = attrs.title;

					scope.$watch(attrs.visible, function(value) {
						if (value == true)
							$(element).modal('show');
						else
							$(element).modal('hide');
					});

					$(element).on('shown.bs.modal', function() {
						scope.$apply(function() {
							scope.$parent[attrs.visible] = true;
						});
					});

					$(element).on('hidden.bs.modal', function() {
						scope.$apply(function() {
							scope.$parent[attrs.visible] = false;
						});
					});
				}
			};
		});