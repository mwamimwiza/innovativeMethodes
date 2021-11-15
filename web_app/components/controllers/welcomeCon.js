custApp = angular.module('angApp', ['ngAnimate']);

custApp.controller('WelcomeController',  function($scope, $http, $window) {

    let host = $window.location.host;

    //all urls
    const URL_GET_USER = "http://"+host+"/getUserById?";
    const URL_GET_USER_RAND = "http://"+host+"/getUserRand";
    const URL_GET_USER_PLANT =  "http://"+host+"/getUserPlant?";
    const URL_GET_TOP_USERS = "http://"+host+"/getTopUser";
    const URL_GET_NOTICES_P = "http://"+host+"/getNoticesPlant";
    const URL_GET_NOTICES_C = "http://"+host+"/getNoticesCompany";
    const URL_GET_EVENTS = "http://"+host+"/getAllEvents"



    // -----------------------------------------------------------all variables
    const urlParams = new URLSearchParams($window.location.search);
    $scope.userId = urlParams.get('user');
    $scope.hideDash = true;
    $scope.user = [];
    $scope.users = [];
    $scope.top10 = [];

    //variables about plants
    const photosArray = document.getElementsByClassName('photo')

    //variables about notice:
    const noticeTypes = document.querySelector('.notice-buttons')
    const plantButton = noticeTypes.querySelector('.plant')
    const companyButton = noticeTypes.querySelector('.company')
    const plantDiv = document.querySelector('.notice-board.plant')
    const companyDiv = document.querySelector('.notice-board.company')
    $scope.plantNotices = []
    $scope.companyNotices = []

    //variables about leaderboard
    const rankArray = document.getElementsByClassName('user-rank')

    //variables about event
    const eventTypes = document.querySelector('.event-type')
    const chatButton = eventTypes.querySelector('.chat')
    const sportButton = eventTypes.querySelector('.sport')
    const meditationButton = eventTypes.querySelector('.meditation')
    const chatEvent = document.querySelector('.event-content.chat')
    const sportEvent = document.querySelector('.event-content.sport')
    const meditationEvent = document.querySelector('.event-content.meditation')
    $scope.chatEvents = []
    $scope.sportEvents = []
    $scope. meditationEvents = []

   
    
    //------------------------------------------------------------- basic functions 
    //check the position of user in order to decide whether show the dashboard or not
    $http.get(URL_GET_USER+`userId=${$scope.userId}`)
    .then(function(response){
        $scope.user = response.data[0]
        if($scope.user.UPosition == "admin"){
            $scope.hideDash = false
        }
    });
    //go to profile
    $scope.goToProfile = function(){
        $window.location.href="/profile?user=" + $scope.userId
    }

    //get random 9 users:
    $http.get(URL_GET_USER_RAND).then(function(response){
        $scope.users = response.data
        let photoIndex=0
        $scope.users.forEach(user => {
            $http.get(URL_GET_USER_PLANT+`UserId=${user.UserId}`).then(function(response){
                user.PName = response.data[0].PName
                user.Address = response.data[0].Address
                let plantPic = photosArray[photoIndex].querySelector('.plant')
                let userAvatar = photosArray[photoIndex].querySelector('.user-avatar')
                let text = photosArray[photoIndex].querySelector('.text')

                plantPic.style.backgroundImage = "url('/images" + user.Address +"')";
                userAvatar.style.backgroundImage = "url('/images" + user.UAvatar +"')";
                text.children[0].innerHTML = user.PName;
                text.children[2].innerHTML = user.UName;
                photoIndex++
            })           
        });
    });

    //get notice of plants:
    $http.get(URL_GET_NOTICES_P).then(function(response){
        $scope.plantNotices = response.data
    })
    //get notice of company:
    $http.get(URL_GET_NOTICES_C).then(function(response){
        $scope.companyNotices = response. data
    })

    
    //get top 10 users
    $http.get(URL_GET_TOP_USERS).then(function(response){
        $scope.top10 = response.data;
        let rankIndex = 0
        $scope.top10.forEach( user =>{
            let userAvatar = rankArray[rankIndex].querySelector('.rank-avatar')
            let text = rankArray[rankIndex].querySelector('.rank-info')

            userAvatar.style.backgroundImage = "url('/images" + user.UAvatar +"')";
            text.children[0].innerHTML = user.UName
            text.children[1].innerHTML = user.UPoints
            text.children[2].innerHTML = "points"
            rankIndex++;
        })
    })

    //get all events
    $http.get(URL_GET_EVENTS).then(function(response){
        response.data.forEach( e =>{
            e.EPic = "url('/images" + e.EPic + "')"
            e.EDate = e.EDate.slice(0,10)
            if(e.EType == "chat"){
                $scope.chatEvents.push(e)
            }
            if(e.EType == "sport"){
                $scope.sportEvents.push(e)
            }
            if(e.EType == "meditation"){
                $scope.meditationEvents.push(e)
            }            
        } )
    })

    



    //--------------------------------------------------------functions triggered by clicking

    //show the different type of notices
    $scope.showPlantNotice = function(){
        const currentNotice = noticeTypes.querySelector('.button-active');

        plantDiv.style.display = 'flex';
        companyDiv.style.display = 'none';
        currentNotice.classList.remove('button-active');
        plantButton.classList.add('button-active');
    }

    $scope.showCompanyNotice = function(){
        const currentNotice = noticeTypes.querySelector('.button-active');

        companyDiv.style.display = 'flex';
        plantDiv.style.display = 'none';
        currentNotice.classList.remove('button-active');
        companyButton.classList.add('button-active');
    }


    //show the different type of events
    $scope.chatEventActive = function(){

        const currentEvent = eventTypes.querySelector('.button-active')

        chatEvent.style.display = "flex";
        sportEvent.style.display = 'none';
        meditationEvent.style.display = 'none';
        currentEvent.classList.remove('button-active');
        chatButton.classList.add('button-active');

    }

    //show the div og sport events
    $scope.sportEventActive = function(){

        const currentEvent = eventTypes.querySelector('.button-active')

        sportEvent.style.display = 'flex';
        chatEvent.style.display = 'none';
        meditationEvent.style.display = 'none';
        currentEvent.classList.remove('button-active');
        sportButton.classList.add('button-active');

    }

    //show the div of meditation events
    $scope.meditationEventActive = function(){

        const currentEvent = eventTypes.querySelector('.button-active')

        meditationEvent.style.display = 'flex';
        sportEvent.style.display = 'none';
        chatEvent.style.display = 'none';
        currentEvent.classList.remove('button-active');
        meditationButton.classList.add('button-active');
    }



})