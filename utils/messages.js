let moment = require('moment');

//format the message display
function formatMessage(userAvatar,username,text){

    return {
        userAvatar,
        username,
        text,
        time:moment().format('h:mm a')
    }
}

module.exports=formatMessage;