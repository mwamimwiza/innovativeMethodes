custApp = angular.module('angApp', ['ngAnimate']);

custApp.controller('WelcomeController',  function($scope, $http, $window) {

    let host = $window.location.host

    //all urls
    const URL_GET_USER = "http://"+host+"/getUserById?"


    // all variables
    const urlParams = new URLSearchParams($window.location.search);
    $scope.userId = urlParams.get('user')
    $scope.user = []
    $scope.hideDash = true

    $http.get(URL_GET_USER+`userId=${$scope.userId}`)
    .then(function(response){
        $scope.user = response.data[0]
        if($scope.user.UPosition == "admin"){
            $scope.hideDash = false
        }
    })

})