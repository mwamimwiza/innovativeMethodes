acticityApp = angular.module('angActivityApp', []);

acticityApp.controller('chatController', function ($scope, socket) {
    socket = io.connect(); 
    $scope.joinBtn = function joinMe() {
        // run when client join an activity
        io.on('connection', socket => {
            socket.on('joinActivity', ({ userAvatar, username, activity }) => {
                let user = userJoin(socket.id, userAvatar, username, activity);

                socket.join(user.activity);

                //welcome current user
                socket.emit('message', formatMessage(userAvatar, botName, 'Welcome to Plantery', ''));

                //broadcast when a user connects
                socket.broadcast
                    .to(user.activity)
                    .emit('message', formatMessage(botName, `${user.username} has joined the chat`, ''));

                //send users and activity info
                io.to(user.activity)
                    .emit('activityUsers', {
                        activity: user.activity,
                        users: getActivityUsers(user.activity)
                    });
            });

            //Listen for chatMessage 
            socket.on('chatMessage', msg => {
                //emit message to all users 
                let user = getCurrentUser(socket.id);
                io.to(user.activity)
                    .emit('message', formatMessage(user.userAvatar, user.username, msg))
            });
            //runs when user disconnects 
            socket.on('disconnect', () => {
                let user = userLeave(socket.id);
                if (user) {
                    io.to(user.activity)
                        .emit('message', formatMessage(botName, `${user.username} has left the chat`, ''));

                    //send users and activity info
                    io.to(user.activity)
                        .emit('activityUsers', {
                            activity: user.activity,
                            users: getActivityUsers(user.activity)
                        });

                }
            });
        });
    }
});
