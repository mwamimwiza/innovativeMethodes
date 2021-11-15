reportApp = angular.module('angSentRepApp', []);

reportApp.controller('SentRepController',  function($scope, $http, $window) {

	// let host = "http://localhost:8888";

    let host = "http://" + $window.location.host
	
	let URL_ALL_COMMENTS = host + "/getAllComments";
	let URL_INSERT_COMMENT = host +  "/insComment?";

    let URL_ALL_USERS = host + "/getAllUsers";
    
    $scope.comments = [];
	$scope.users = [];
			
	$http.get(URL_ALL_COMMENTS).then(function(response) {
		
      $scope.comments =  response.data;
      console.log($scope.comments);
      
    });

    $http.get(URL_ALL_USERS).then(function(response) {
		
        $scope.users =  response.data;
        
    });
})