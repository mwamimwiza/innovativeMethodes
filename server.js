
let path = require('path');
let express = require('express');
let ejs = require('ejs');
let mysql = require('mysql');
let http = require('http');
let socketio = require('socket.io');
let formatMessage = require('./utils/messages');
let {
    userJoin,
    getCurrentUser,
    userLeave,
    getActivityUsers,
    clickedActivity,
} = require('./utils/users');

let app = express();
let server = http.createServer(app);
let io = socketio(server);

//set static home page 
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

//create mysql connection 
let db = mysql.createConnection({
    /*host: 'localhost',
    user: 'root',
    password: 'kagabo@!',
    database: 'plantery'*/
    host: 'etu-web2.ut-capitole.fr',
    //port: 3060,
    user: '21812109',
    password: 'T017F9',
    database: 'db_21812109_2'
});

//connect to mysql db
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql connected...!')
})

//create login route 
app.get('/login', function (req, res) {
    let user = (req.query.username);
    let password = (req.query.password);


    let sqlQuery = 'SELECT UserId,UName,UAvatar,UPoints FROM Users WHERE UName=? AND UPwd=?';
    let values = [user, password];
    let postSQL = function (err, result) {
        if (err) throw err;
        id=result[0].UserId;
        queryPlant='SELECT PName,PAvatar,PTemp,Phumidity,Pmoisture FROM Plants WHERE UserId=?';
        queryValues=(id);
        db.query(queryPlant,queryValues,(err,results)=>{
            if(err) throw err;
            res.setHeader('Content-Type', 'text/html');
            res.render('home.html', {userId:result[0].UserId,username: result[0].UName, avatar: result[0].UAvatar,points:result[0].UPoints,temp: results[0].PTemp,humidity: results[0].Phumidity,moisture: results[0].Pmoisture,plantName:results[0].PName,plantAvatar:results[0].PAvatar });
        })
        
    }
    db.query(sqlQuery, values, postSQL)


})

//activity route 
app.get('/activity', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('activity.html')
})

//home route 
app.get('/home', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    let user = (req.query.username);
    let avatar = (req.query.userAvatar);
    res.render('home.html', { username: user, userAvatar: avatar })
})

//create a chat bot name to welcome new users in chat
let botName = 'ChatBot';
let botAvatar = 'userAvatar';

//run when client click on an activity
io.on('connection', socket => {

    socket.on('joinActivity', ({ userAvatar, username, activity }) => {
        let usersNum={}; 
        let user = clickedActivity(socket.id, userAvatar, username, activity);
        socket.join(user.activity);

        //then display the activity
        io.to(user.activity)
            .emit('activityUsers', {
                activity: user.activity,
                users: getActivityUsers(user.activity)
            });

        socket.on('joinMe', ({ userAvatar, username, activity }) => {
            let user = userJoin(socket.id, userAvatar, username, activity);
            socket.join(user.activity);
            if(usersNum[user.activity]==undefined){
                usersNum[user.activity]=1;
                console.log(usersNum)
        }else{
            usersNum[user.activity]++;
            console.log(usersNum)
        }
            //welcome the current user 
            socket.emit('message', formatMessage('/images/chatbot.png',`Welcome ${user.username}`, '', ''));

            //broadcast to all connected user when the new user connects
            socket.broadcast
                .to(user.activity)
                .emit('message', formatMessage('/images/chatbot.png', `${user.username} has joined`, ''));

            //overwrite active users 
            io.to(user.activity)
                .emit('activityUsers', {
                    activity: user.activity,
                    users: getActivityUsers(user.activity)
                });
        })
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
                usersNum[user.activity]--;
                console.log(usersNum);
                if (user) {
                    io.to(user.activity)
                        .emit('message', formatMessage('/images/chatbot.png', `${user.username} has left the chat`, ''));
    
                    //send users and activity info
                    io.to(user.activity)
                        .emit('activityUsers', {
                            activity: user.activity,
                            users: getActivityUsers(user.activity)
                        });
    
                }

            
           
        });
    })
});



// run when client join an activity
// io.on('connection', socket => {
//     socket.on('joinActivity', ({ userAvatar, username, activity }) => {
//         let user = userJoin(socket.id, userAvatar, username, activity);

//         socket.join(user.activity);

//         //welcome current user
//         socket.emit('message', formatMessage(userAvatar, botName, 'Welcome to Plantery', ''));

//         //broadcast when a user connects
//         socket.broadcast
//             .to(user.activity)
//             .emit('message', formatMessage(botName, `${user.username} has joined the chat`, ''));

//         //send users and activity info
//         io.to(user.activity)
//             .emit('activityUsers', {
//                 activity: user.activity,
//                 users: getActivityUsers(user.activity)
//             });
//     });

//     //Listen for chatMessage 
//     socket.on('chatMessage', msg => {
//         //emit message to all users 
//         let user = getCurrentUser(socket.id);
//         io.to(user.activity)
//             .emit('message', formatMessage(user.userAvatar, user.username, msg))
//     });
//     //runs when user disconnects 
//     socket.on('disconnect', () => {
//         let user = userLeave(socket.id);
//         if (user) {
//             io.to(user.activity)
//                 .emit('message', formatMessage(botName, `${user.username} has left the chat`, ''));

//             //send users and activity info
//             io.to(user.activity)
//                 .emit('activityUsers', {
//                     activity: user.activity,
//                     users: getActivityUsers(user.activity)
//                 });

//         }
//     });
// });

let PORT = 3008 || process.env.PORT;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));