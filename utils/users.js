

let users = []

//Join user to activity 
function clickedActivity(id,userAvatar,username,activity){
    let clickedActivity = {id,userAvatar,username,activity};
    return clickedActivity;
}

//Join user to activity chat
function userJoin(id,userAvatar,username,activity){
    let user = {id,userAvatar,username,activity};

    users.push(user);

    return user;
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id=== id);
}

//user leaves chat 

function userLeave(id){

    let index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

//get activity users 

function getActivityUsers(activity){
    return users.filter(user => user.activity == activity);
}

module.exports ={
    userJoin,
    getCurrentUser,
    userLeave,
    getActivityUsers,
    clickedActivity
};