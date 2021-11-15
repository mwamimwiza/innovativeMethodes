
let chatMessages = document.querySelector('.chat-messages');
let roomName = document.getElementById('activityName');
let usersList = document.getElementById('users');

//get userAvatar username activity from URL
let { userAvatar, username, activity } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

let socket = io();

//join activity 
socket.emit('joinActivity', { userAvatar, username, activity });

//get activity and users 
 socket.on('activityUsers', ({ activity, users }) => {
    outputActivityName(activity);
     outputUsers(users);
 });

//add activity name to DOM

function outputActivityName(room) {
    activityName.innerText = room;
}

//add users to DOM 
function outputUsers(users) {
    usersList.innerHTML = `
    ${users.map(user => `
    <li class="list-group-item">
                                    <figure>
                                        <img id="userAvatar" class="w-100" src="${user.userAvatar}">
                                        <figcaption style="font-size: 10px;" id="username">${user.username}</figcaption>
                             
                                    </figure>
        
                                </li>`).join('')}
    `
    ;

}
