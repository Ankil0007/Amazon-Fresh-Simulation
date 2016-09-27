
var personfollowerslist = angular.module('personfollowerslist', ['ngSanitize']);
personfollowerslist.directive('dir', function($compile, $parse) {
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
personfollowerslist.controller('profile', function($scope, $http) {
	
	$scope.initprofile = function() {

		$http({
			method : "POST",
			url : '/getpersonfollowerslist/inheader/intime',
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert('Unexpected error');
			} else
				{
		
				$scope.users=data.users;
				$scope.profile=data.profile;
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}
});

personfollowerslist.controller('inheader', function($scope, $http) {
	
	$scope.initheader = function() {
	
		$http({
			method : "POST",
			url : '/getpersonfollowerslist/inheader/intime',
		}).success(function(data) {
			
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert('Unexpected error');
			} else
				{
			
				//alert(data.users[0].fullname);
				$scope.users = data.users;
				$scope.profile= data.profile;
			   $scope.fullname = data.users[0].fullname;
			   $scope.username = data.profile[0].username;
			   $scope.profilepic = data.profilepic;
			   $scope.followersupdate = data.followers;
			   $scope.followingupdate = data.following;   
			   $scope.tweetupdate = data.tweetcount;
				}
		}).error(function(error) {
			alert('Unexpected error');
		});
	}
	$scope.followerslist = function() {	

		window.location.assign("/getpersonfollowerslist/" + document.getElementById("hiddendata").value);
}
$scope.followinglist = function() {	

	window.location.assign("/getpersonfollowinglist/"+document.getElementById("hiddendata").value);
}

$scope.tweetlist = function() {	
	
	window.location.assign("/getpersontweetlist/"+document.getElementById("hiddendata").value);
}
})


personfollowerslist.controller('list', function($scope, $http,$location) {
	
	$scope.initlist = function() {	
		
		$scope.showtweets = true;
		$scope.showfollowers = true;
	
		var url = $location.absUrl();
		var parturl = url.split('/');
		
		if(parturl[parturl.length-2] == "getpersonfollowerslist")
			{

		$scope.started = false;
		$scope.nosuggestions = true;
		$scope.followersorfollowing = "Followers";
		$http({
			method : "POST",
			url : '/getpersonfollowerslist/personlistfollwers/intime'	
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert("Unexpected error")
			} else {
				//Making a get call to the '/redirectToHomepage' API
				if(data.statusCode==300){
					$scope.nosuggestions = false;
				}
				else{
					$http({
						method : "POST",
						url : '/getpersonfollowerslist/personlistfollwing/intime'	
					}).success(function(data1) {
						if (data1.statusCode == 401) {
							alert("Unexpected error")
						} else {
			
							var arrayflags = [];
							for(var i=0;i<data.records.length;i++){
								var tempflag = false;
								for(var j=0;j<data1.records.length;j++){	
									
									if(data.records[i].userid == data1.records[j].userid ){
										tempflag = true;
										break;
									}	
								}
								arrayflags.push(tempflag);
							}	
							$scope.arrayflags = arrayflags;
							$scope.followerdetails = data.records;
							$scope.showfollowers = false;
						}
					}).error(function(error) {
						alert("Unexpected error")
					});
				}
				
			}
		}).error(function(error) {
			alert("Unexpected error")
		});
	}
		else if(parturl[parturl.length-2] == "getpersonfollowinglist"){
			
			$scope.nosuggestions = true;
			
			
			$http({
				method : "POST",
				url : '/getpersonfollowerslist/personlistfollwing/intime'	
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					alert("Unexpected error")
				} else {
					
					//Making a get call to the '/redirectToHomepage' API
					if(data.statusCode==300){
						$scope.nosuggestions = false;
					}
					else{
					$scope.followerdetails = data.records;
					var arrayflags = [];
					for(var i=0;i<data.records.length;i++){
						arrayflags.push(true);
					}
					$scope.arrayflags = arrayflags;
					$scope.showfollowers = false;
					}
					
				}
			}).error(function(error) {
				alert("Unexpected error")
			});
		}
		else if(parturl[parturl.length-2] == "getpersontweetlist"){
			
			$scope.notweets = true;
			$http({
				method : "POST",
				url : '/getpersonfollowerslist/persontweetlist/intime'	
			}).success(function(data) {
				//checking the response data for statusCode
				
				if (data.statusCode == 401) {
					alert("Unexpected error")
				} else {
					//Making a get call to the '/redirectToHomepage' API
					if(data.statusCode != 300){
					
						var arryfeed = [];
														for (var i = 0; i < data.records.length; i++) {

															var tempstr = "<h4><strong ng-click='clickperson($index)' class='mystrong'>"
																	+ data.records[i].fullname
																	+ "</strong><small>"
																	+ data.records[i].username
																	+ "</small><h4><h5>"
																	+ data.records[i].tweets
																	+ "</h5>";

															if (typeof data.retweetinfo != 'undefined') {

																for (var j = 0; j < data.retweetinfo.length; j++) {
																	if (data.retweetinfo[j].tweetid == data.records[i].retweetuserid) {

																		tempstr += "<div class='panel panel-info'><div class='panel-heading'><div class='row'><div class='col-md-1'><img src='/images/favicon.ico' style='width:30px;height:30px'/>"
																				+ "</div><div class='col-md-11'><h4><strong>"
																				+ data.retweetinfo[j].fullname
																				+ "</strong><small>"
																				+ data.retweetinfo[j].username
																				+ "</small></h4><h5>"
																				+ data.retweetinfo[j].tweets
																				+ "</h5></div></div></div></div>";

																	}

																}

															}

															arryfeed
																	.push({
																		"value" : tempstr,
																		"image" : "/images/tweetegg.png"
																	});

														}

														$scope.feed = arryfeed;
														$scope.showtweets = false;
													} else {
														$scope.notweets = false;
													}
												}

											}).error(function(error) {
										alert("Unexpected error")
			});
		}
	}
	$scope.follow = function(x) {	
		
		$http({
			method : "POST",
			url : '/addfollower',
			data : {
				"id" : $scope.followerdetails[x].userid
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert("Unexpected error")
			} else {
				window.location.assign("/getpersonfollowerslist");
			}
		}).error(function(error) {
			alert("Unexpected error")
		});
	}
	
	$scope.clickperson = function(x){
		
	     window.location.assign("/personhomepage/"+$scope.followerdetails[x].userid);
		}
	
})
