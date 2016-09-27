//loading the 'login' angularJS module


var homepage = angular.module('homepage', ['ngSanitize']);
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

homepage.controller('header', function($scope, $http) {
	$scope.init = function(){
		
	var userid = document.getElementById('hiddendata').value;
		$scope.hiddendata = true;
		$http({
			method : "POST",
			url : '/personcount',
			data : {
				"userid" : userid
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert("Unexpected error")
			} else {
				//Making a get call to the '/redirectToHomepage' API
				$scope.followersupdate = data.followers;
				$scope.followingupdate = data.following;
				$scope.tweetupdate = data.tweets;

			}
		}).error(function(error) {
			alert("Unexpected error")
		});
		
		
			
	}
	$scope.followerslist = function() {	
		var userid = document.getElementById('hiddendata').value;
			window.location.assign("/getpersonfollowerslist/"+userid);
	}
	$scope.followinglist = function() {	
		var userid = document.getElementById('hiddendata').value;
		window.location.assign("/getpersonfollowinglist/"+userid);
}	
	$scope.tweetlist = function() {	
		var userid = document.getElementById('hiddendata').value;
		window.location.assign("/getpersontweetlist/"+userid);
}	
	
})

homepage.controller('twitterfeed', function($scope, $http) {
	
$scope.init = function(){
	
	var userid = document.getElementById('hiddendata1').value;
	$scope.notweets = true;
	$http({
		method : "POST",
		url : '/personhomepagetweetlist',	
			data :{
				"userid" : userid
			}
	}).success(function(data) {
		//checking the response data for statusCode
		
		if (data.statusCode == 401) {
			alert("Unexpected error")
		} else {
			//Making a get call to the '/redirectToHomepage' API
			if(data.statusCode != 300){
			
				var arryfeed = [];
			for(var i=0;i<data.records.length;i++){
				
				var tempstr = "<h4><strong>"
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
			$scope.showtweets = false;	
			}	
			else{
				$scope.notweets = false;
			}			
		}
		
	}).error(function(error) {
		
		alert("Unexpected error")
	});
}
})
