//loading the 'login' angularJS module
var index = angular.module('index', []);
// defining the login controller

index.controller('index', function($scope, $http) {
	// Initializing the 'invalid_login' and 'unexpected_error'
	// to be hidden in the UI by setting them true,
	// Note: They become visible when we set them to false
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.showModal = false;
	$scope.signuphome = function() {
		window.location.assign("/signup");
	}
	$scope.loginhome = function() {
		$scope.showModal = !$scope.showModal;
		// window.location.assign("/login/login");
	}

	$scope.checklogin = function() {

		$http({
			method : "POST",
			url : '/login/loginnext',
			data : {
				"loginid" : $scope.email,
				"loginpassword" : $scope.password
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			} else
				// Making a get call to the '/redirectToHomepage' API
				window.location.assign("/userhomepage");
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
		// window.location.assign("/login/login");
	}
})
index
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

var homepage = angular.module('homepage', [ 'ngSanitize' ])

homepage
		.directive(
				'modal',
				function() {
					return {
						template : '<div class="modal fade">'
								+ '<div class="modal-dialog">'
								+ '<div class="modal-content">'
								+ '<div class="modal-header">'
								+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
								+ '<h4 class="modal-title">{{ title }}</h4>'
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

homepage.controller('counts', function($scope, $http, $rootScope) {
	$scope.init = function() {
		$rootScope.followersupdate = 0;
		$rootScope.followingupdate = 0;
		$rootScope.tweetupdate = 0;
	}
	$scope.followerslist = function() {
	
		window.location.assign("/getfollowerslist");
	}
	$scope.followinglist = function() {
		
		window.location.assign("/getfollowinglist");
	}
	$scope.tweetlist = function() {
		window.location.assign("/gettweetlist");
	}
})

homepage.controller('profile', function($scope, $http) {
	$scope.init = function() {
		$scope.showProfile = false;
	}
	$scope.showprofilepopup = function() {
		
		$scope.showProfile = !$scope.showProfile;
		$scope.fullname = document.getElementById("fullname").value;
		$scope.bio = document.getElementById("bio").value;
		$scope.loc = document.getElementById("location").value;
		$scope.birthday = document.getElementById("birthday").value;
		$scope.website = document.getElementById("website").value;
		$scope.countrycode = document.getElementById("countrycode").value;
		$scope.phoneno = document.getElementById("phonenum").value;
	}

	$scope.savechanges = function() {
		var arr  = [];
		arr.push($scope.bio)
		arr.push($scope.loc)
		arr.push($scope.birthday)
		arr.push($scope.website)
		arr.push($scope.countrycode)
		arr.push($scope.phoneno)
		
		for(var i=0;i<arr.length;i++){
			if(typeof arr[i] == 'undefined'){
				arr[i] = "";
			}
		}
		
		
		$http({
			method : "POST",
			url : '/savechanges',
			data : {
				"fullname" : $scope.fullname,
				"bio" : $scope.bio,
				"loc" : $scope.loc,
				"birthday" : $scope.birthday,
				"website" : $scope.website,
				"countrycode" : $scope.countrycode,
				"phoneno" : $scope.phoneno
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				alert("Unexpected error")
			} else {
				// Making a get call to the '/redirectToHomepage' API
				window.location.assign("/userhomepage");

			}
		}).error(function(error) {
			alert("Unexpected error")
		});
	}
})

homepage.controller('whomtofollow', function($scope, $http, $rootScope) {

	$scope.init = function() {
       
		$scope.nosuggestions = true;
		$http({
			method : "POST",
			url : '/suggestions',
			data : {

			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				alert("Unexpected error")
			} else {
				$rootScope.followersupdate = data.followers;
				$rootScope.followingupdate = data.following;
				$scope.suggestions = data.records;
			}
		}).error(function(error) {
			alert("Unexpected error")
		});
	}

	$scope.removeItem = function(x) {

		$http({
			method : "POST",
			url : '/suggestions',
			data : {

			}
		}).success(function(data) {

			if (data.statusCode == 401) {
				alert("Unexpected error")
			} else {

				$scope.suggestions.splice(x, 1);
				if (data.records != null && data.records.length > 0) {

					$scope.suggestions.splice(x, 0, data.records[0]);
				}
				if ($scope.suggestions.length == 0) {
					$scope.nosuggestions = false;
				}

			}
		}).error(function(error) {
			alert("Unexpected error")
		});
	}
	$scope.addfollowingfromsuggestion = function(x) {

		$http({
			method : "POST",
			url : '/addfollower',
			data : {
				"id" : $scope.suggestions[x].userid

			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				alert("Unexpected error")
			} else {
				// Making a get call to the '/redirectToHomepage' API
				// $scope.followingupdate = data.following;
				$rootScope.followingupdate = data.following;
				
				$scope.removeItem(x);

			}
		}).error(function(error) {
			alert("Unexpected error")
		});

	}
})
homepage.directive('dir', function($compile, $parse) {
	return {
		restrict : 'E',
		link : function(scope, element, attr) {
			scope.$watch(attr.content, function() {
				element.html($parse(attr.content)(scope));
				$compile(element.contents())(scope);
			}, true);
		}
	}
})
homepage.controller('twitterfeed',function($scope, $http, $rootScope) {
					var popupinfo;
					$scope.clickperson = function(x){		
					     window.location.assign("/personhomepage/"+popupinfo[x].id);
						}
					$scope.init = function() {

						$scope.showModal = false;
						$scope.notweets = true;
						$http({
							method : "POST",
							url : '/twitterfeed',
							data : {

							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 401) {
											} else {
												// Making a get call to the
												// '/redirectToHomepage' API
												if (data.statusCode != 300) {
													popupinfo = data.records;
													
													var arryfeed = [];
													for (var i = 0; i < data.records.length; i++) {

														var tempstr = "<h4 ><strong class='mystrong' ng-click ='clickperson($index)'>"
																+ data.records[i].fullname
																+ "</strong><small>"
																+ data.records[i].username
																+ "</small><h4><h5>"
																+ data.records[i].tweets
																+ "</h5>";
														if (typeof data.retweetinfo != 'undefined') {
															
															for (var j = 0; j < data.retweetinfo.length; j++) {
																if (data.retweetinfo[j].tweetid == data.records[i].retweetuserid) {

																	tempstr += "<div class='panel panel-info'><div class='panel-heading'><div class='row'><div class='col-md-1'><img src='/images/favicon.ico' style='width:30px;height:30px'/>" +
																			"</div><div class='col-md-11'><h4><strong>"
																			+ data.retweetinfo[j].fullname
																			+ "</strong><small>"
																			+ data.retweetinfo[j].username
																			+ "</small></h4><h5>"
																			+ data.retweetinfo[j].tweets
																			+ "</h5></div></div></div></div>";
																}

															}

														}
														
															arryfeed.push({
																"value" : tempstr,
																"image" : "/images/tweetegg.png"
															});
														

													}
						
													
													
													$scope.feed = arryfeed;
													
													// $scope.feed =
													// data.records;
													var count = 0;
													for (var i = 0; i < data.records.length; i++) {
														if (data.records[i].userid == data.userid) {
															count++;
														}
														$rootScope.tweetupdate = count;
													}
												} else {
													$scope.notweets = false;
												}
											}
										}).error(function(error) {
									alert("Unexpected error")
								});
					}

					$scope.addtweet = function() {

						if ($scope.tweet.trim().length > 0) {
							$http({
								method : "POST",
								url : '/addtweet',
								data : {
									"tweet" : $scope.tweet
								}
							}).success(function(data) {
								// checking the response data for statusCode
								if (data.statusCode == 401) {
									alert("Unexpected error")
								} else {
									$scope.tweet = "";
									$scope.init();
									// Making a get call to the
									// '/redirectToHomepage' API

								}
							}).error(function(error) {
								alert("Unexpected error")
							});
						}
					}
					
					var index;
					$scope.retweetshow = function(x) {
						index = x;
						$scope.showModal = !$scope.showModal;
						if (typeof popupinfo[x].tweets != 'undefined') {
							$scope.originaltweet = "<div class='panel panel-info'><div class='row'><div class='col-md-1'><img src='/images/favicon.ico' style='width:30px;height:30px'/>" +
																			"</div><div class='col-md-11'><h4><strong>"
									+ popupinfo[x].fullname + "</strong><small>"
									+ popupinfo[x].username + "</small><h4><h5>"
									+ popupinfo[x].tweets + "</h5></div></div></div>";
						} else {
							$scope.originaltweet = "<div class='panel panel-info'><div class='row'><div class='col-md-1'><img src='/images/favicon.ico' style='width:30px;height:30px'/>" +
																			"</div><div class='col-md-11'><h4><strong>"
									+ popupinfo[x].fullname + "</strong><small>"
									+ popupinfo[x].username + "</small><h4><h5></div></div></div>";
						}
					}

					$scope.retweet = function() {
						if(typeof $scope.retweetarea != 'undefined' && $scope.retweetarea.trim().length>0){
						$http({
							method : "POST",
							url : '/retweet',
							data : {
								"tweetid" : popupinfo[index].tweetid,
								"tweetarea" : $scope.retweetarea
							}
						}).success(function(data) {
							//checking the response data for statusCode
							if (data.statusCode == 401) {
								alert("Unexpected error")
							} else {

								$scope.init();
								$scope.retweetarea = "";

							}
						}).error(function(error) {
							alert("Unexpected error")
						});
					}
					}
					
					
					
				})
