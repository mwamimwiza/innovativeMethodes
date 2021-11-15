custApp = angular.module('angApp', ['ngAnimate']);

custApp.controller('ProfileController',  function($scope, $http, $window) {

    let host = $window.location.host;

    //all urls
    const URL_GET_USER = "http://"+host+"/getUserById?";


    //---------------------------------------------------------variables
    //------basic variables
    const urlParams = new URLSearchParams($window.location.search);
    const allParts = document.querySelector('.contentDiv')
    const partArrays = Array.from(allParts.children)
    const allPartButtons = document.querySelector('.profileDiv .button-list')
    const partButtonArrays = Array.from(allPartButtons.children)


    $scope.userId = urlParams.get('user');
    $scope.hideDash = true;




    //------------------------------------------------------------- basic functions 
    //check the position of user in order to decide whether show the dashboard or not
    $http.get(URL_GET_USER+`userId=${$scope.userId}`)
    .then(function(response){
        $scope.user = response.data[0]
        if($scope.user.UPosition == "admin"){
            $scope.hideDash = false
        }
    });
    //go to welcome
    $scope.goToWelcome = function(){
        $window.location.href="/welcome?user=" + $scope.userId
    }


    //change the content when clicking the buttons in profile div
    $scope.switchPart = function(event){

        typeof event !== "undefined"
        let targetButton = event.target.closest('.button')
        if(!targetButton) return;

        let currentPart = allParts.querySelector('.current-part')
        let currentButton = allPartButtons.querySelector('.button-active')
        let targetIndex = partButtonArrays.findIndex(btn => btn === targetButton)
        let targetPart = partArrays[targetIndex]
        
        currentPart.classList.remove('current-part')
        currentButton.classList.remove('button-active')
        targetPart.classList.add('current-part')
        targetButton.classList.add('button-active')
    



    }
});