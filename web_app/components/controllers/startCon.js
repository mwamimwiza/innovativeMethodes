custApp = angular.module('angApp', ['ngAnimate']);

custApp.controller('StartController',  function($scope, $http, $window) {

    let host = $window.location.host
    //urls:
    let URL_ALL_USERS = "http://"+host+"/getUsers";
    let URL_GET_USER = "http://"+host+"/getUser?";

    // variables
    $scope.hideStart = false;
    $scope.hideLogin = true;
    $scope.users = []

    //get data from db



    //ng click functions
    $scope.getStarted = function(){
        $scope.hideStart = true;
        $scope.hideLogin = false;
    }
    /// verify the login information
    $scope.verifyUser = function(){
        //check if there are null value
        if(($scope.inputUserEmail != null)&&($scope.inputUserPwd != null)){
            // check the email format
            let rigntEmail = false
            for (c in $scope.inputUserEmail) {
                if($scope.inputUserEmail[c] == "@"){
                    rigntEmail = true
                }
            }
            if(rigntEmail == false){
                alert("The email format is not correct")
            }
            // check if user exist or if passward is correct
            $http.get(URL_GET_USER + `email=${$scope.inputUserEmail}`)
            .then(function(response){
                $scope.user = response.data
                if (!$scope.user.length) {
                    alert("User doesn't exist!")
                }
                else{
                    if($scope.user[0].UPwd != $scope.inputUserPwd){
                        alert("Incorrect password!")
                    }
                    else{
                        $window.location.href="/welcome?user=" + $scope.user[0].UserId
                    }
                }
            })

        }
        else{
            alert("Fields can't be empty!")
        }

    }
})