custApp = angular.module('angApp', ['ngAnimate']);

custApp.controller('ProfileController',  function($scope, $http, $window) {

    let host = $window.location.host;

    //all urls
    const URL_GET_USER = "http://"+host+"/getUserById?";
    const URL_GET_USER_PlANTS = "http://"+host+ "/getUserPlants?" 
    const URL_GET_PLANT_PHOTOS = "http://"+host+ "/getPlantPhotos?"


    //---------------------------------------------------------variables
    //------basic variables
    const urlParams = new URLSearchParams($window.location.search);
    const allParts = document.querySelector('.contentDiv')
    const partArrays = Array.from(allParts.children)
    const allPartButtons = document.querySelector('.profileDiv .button-list')
    const partButtonArrays = Array.from(allPartButtons.children)
    ////variables about user
    const userAvatar = document.querySelector('.user-avatar')
    const userName = document.querySelector('.user-name')
    const userScore = document.querySelector('.score')
    ////variables about plant

    const plantName = document.getElementById('plant-name')
    const plantVariety = document.getElementById('plant-variety')
    const plantAge = document.getElementById('plant-age')
    const plantLocation = document.getElementById('plant-location')
    const plantWater = document.getElementById('plant-water')
    const plantLight = document.getElementById('plant-light')
    const plantTemp = document.getElementById('plant-temp')

    const plantPicArray = Array.from(document.getElementsByClassName('plant-photo'))
    const indicatorArray = Array.from(document.getElementsByClassName('indicator-data'))

    console.log(indicatorArray)



    $scope.userId = urlParams.get('user');
    $scope.hideDash = true;
    $scope.user = [];
    $scope.plants = [];



    //------------------------------------------------------------- basic functions 
    //calculate the differences between a date and now
    function getAge(start){
        let date1 = new Date();
        let date2 = new Date(start);
        const oneDay = 1000 * 60 * 60 * 24;
        const diffInTime = date1.getTime() - date2.getTime();
        const diffInDays = Math.round(diffInTime / oneDay);
        return diffInDays;
    }
    //check the position of user in order to decide whether show the dashboard or not then load all the user information
    $http.get(URL_GET_USER+`userId=${$scope.userId}`)
    .then(function(response){
        $scope.user = response.data[0]
        if($scope.user.UPosition == "admin"){
            $scope.hideDash = false
        }
        //load user avatar, name, score, badges
        userAvatar.style.backgroundImage = "url('/images" + $scope.user.UAvatar +"')";
        userName.innerHTML = $scope.user.UName
        userScore.innerHTML = $scope.user.UPoints
        

        //load user plants info
        $http.get(URL_GET_USER_PlANTS+`UserId=${$scope.userId}`)
        .then(function(response){
            response.data.forEach(element => {
                element.PAvatar = "url('/images" + element.PAvatar + "')"
                element.PAge = getAge(element.PDate.substr(0,10)) + " days"
                //define the frindship level
                element.PFriend = "Good Friend"
                if(element.PFriendship < 300){
                    element.PFriend = "New Friend"
                }
                if(element.PFriendship > 800){
                    element.PFriend = "Best Friend"
                }
            });
            $scope.plants = response.data
           
            //load the info of first plant defaultly 
            plantName.innerHTML = $scope.plants[0].PName
            plantVariety.innerHTML = $scope.plants[0].PVariety
            plantAge.innerHTML = $scope.plants[0].PAge
            plantLocation.innerHTML =$scope.plants[0].PLocation
            plantWater.innerHTML = $scope.plants[0].PWater
            plantLight.innerHTML = $scope.plants[0].PLight
            plantTemp.innerHTML = $scope.plants[0].PTemp + "°C"
            
            //the five photo of the first plant
            $http.get(URL_GET_PLANT_PHOTOS+`PlantId=${$scope.plants[0].PlantId}`)
            .then(function(response){
              for(let i=0; i<5; i++){
                  if (typeof response.data[i] === 'undefined' ){
                    plantPicArray[4-i].style.backgroundImage = "none"
                  }  
                  else{
                    plantPicArray[4-i].style.backgroundImage = "url('/images" + response.data[i].Address + "')"
                  }                
              }
            });

            //the real-time measurement of plant when loading the web page
            if ($scope.plants[0].PlantId == 4){
                $http.get("http://192.168.1.73:5000/measures")
                .then(function(response){
                    indicatorArray[0].innerHTML = response.data.moisture + "%"
                    indicatorArray[2].innerHTML = response.data.temperature + "°C"
                    if(response.data.light < 10000){
                        indicatorArray[1].innerHTML = "High"
                    }
                    if(response.data.light > 35000){
                        indicatorArray[1].innerHTML = "Low"
                    }
                    if( !(response.data.light<10000) && !(response.data.light > 35000)){
                        indicatorArray[1].innerHTML = "Medium"
                    }
                    
                })
            }
            

            //be able to switch the plants infomation
            $scope.switchPlant= function(event){
                typeof event !== "undefined"
                let targetPlant = event.target.closest('li')
                if(!targetPlant) return;

                let id = targetPlant.id

                $scope.plants.forEach(p => {
                    if (p.PlantId == id){
                        plantName.innerHTML = p.PName
                        plantVariety.innerHTML = p.PVariety
                        plantAge.innerHTML = p.PAge
                        plantLocation.innerHTML =p.PLocation
                        plantWater.innerHTML = p.PWater
                        plantLight.innerHTML = p.PLight
                        plantTemp.innerHTML = p.PTemp + "°C"
                    }
                })

                $http.get(URL_GET_PLANT_PHOTOS+`PlantId=${id}`)
                .then(function(response){
                for(let i=0; i<5; i++){
                    if (typeof response.data[i] === 'undefined' ){
                        plantPicArray[4-i].style.backgroundImage = "none"
                    }  
                    else{
                        plantPicArray[4-i].style.backgroundImage = "url('/images" + response.data[i].Address + "')"
                    }                
                }
                });




            }
        
            
        })
        


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