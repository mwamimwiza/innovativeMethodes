module.exports = (app, db, axios) => {

    // send the start page of web app
    app.get('/', function(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/start.html');
    });

    //send the welcome page 
    app.get('/welcome', function(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/welcome.html');
    });
    //send profile page
    app.get('/profile',function(req,res){
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/profile.html');
    })


    //require db (TESTED)
    app.get('/getUsers',function(req,res){
        let sql = 'SELECT * FROM Users';
        let processSQL =   function (err, result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, processSQL);
    })

    //get user by email (tested)
    app.get('/getUser',function(req,res){
        let email = (req.query.email)

        let sql = 'SELECT * FROM Users WHERE UEmail = ?';
        values = [email]

        let processSQL =   function (err, result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    })

    //get user by Id(tested)
    app.get('/getUserById',function(req,res){

        let userId = (req.query.userId)

        let sql = 'SELECT * FROM Users WHERE UserId = ?';
        values = [userId]

        let processSQL =   function (err, result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
        
    })

    //select randomly 9 users(TD)
    app.get('/getUserRand',function(req,res){

        let sql = 'SELECT UserId, UName, UAvatar FROM Users ORDER BY RAND() DESC LIMIT 9'
        let processSQL = function(err, result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql,processSQL);
    })

    // get the name and a latest photo of one of the plants of user demanded(TD)
    app.get('/getUserPlant', function(req,res){

        let UserId = (req.query.UserId)
        let sql = 'SELECT p1.PName, p2.Address FROM Plants p1 INNER JOIN PlantPhotos p2 ON p1.PlantId = p2.PlantId WHERE p1.UserId= ? ORDER BY p2.Date DESC LIMIT 1'
        let values = [UserId]
        let processSQL = function(err, result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql, values, processSQL);
    })

    //get top 10 users(TD)
    app.get('/getTopUser',function(req,res){

        let sql = 'SELECT UName, UAvatar,UPoints FROM Users ORDER BY UPoints DESC LIMIT 10'
        let processSQL = function(err, result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql,processSQL);
    })

    //get notices about plant.(TD)
    app.get('/getNoticesPlant',function(req,res){
        
        let sql = 'SELECT p.PlantId, p.PName, p.PLocation FROM Plants p INNER JOIN Notices n ON p.PlantId = n.PlantId WHERE n.NType = "plant" ORDER BY n.NDate ASC'
        let processSQL = function(err,result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql,processSQL);
    })

    //get notices about company.(TD)
    app.get('/getNoticesCompany',function(req,res){
        
        let sql = 'SELECT NContent FROM NOtices WHERE NType = "company" ORDER BY NDate DESC'
        let processSQL = function(err,result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql,processSQL);
    })

    //get all events()
    app.get('/getAllEvents',function(req,res){
        let sql = 'SELECT * FROM Events ORDER BY EDate ASC'
        let processSQL = function(err,result) {
            if (err) throw err;
            res.json(result);
        };
        db.query(sql,processSQL);
    })


    //----------------------------------------------------------------- Dashboard routes
    app.get('/sentmentanalysis', function(req, res) {
        // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/sentiment-report.html');
    });

    app.get('/ngSentimentReport.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/js' + '/ngSentimentReport.js');
    });

    app.get('/getAllComments', function(req, res) {
        
        let sqlSelectComments = `
        SELECT comm.rating, comm.comContent, comm.sentimentClass, comm.topic, comm.createTime, comm.userId, user.UName
            FROM comments comm LEFT JOIN users user ON (comm.userId = user.userId)`;
        
        // response contains a json array with all tuples
        let postProcessSQL =   function (err, result) {
            if (err) throw err;

            res.json(result);
        };
        db.query(sqlSelectComments, postProcessSQL);
    });

    app.get('/getAllUsers', function(req, res) {
        
        let sqlSelectUsers = 'SELECT UserId, UName, UPosition FROM users';
        
        // response contains a json array with all tuples
        let postProcessSQL =   function (err, result) {
            if (err) throw err;

            res.json(result);
        };
        db.query(sqlSelectUsers, postProcessSQL);
    });

    app.get('/insertComm', function(req, res) {
        const commentContent = "I love my children";

        axios.post("https://sentim-api.herokuapp.com/api/v1/", {
                    text: commentContent,
            })
            .then((res) => {
                let sentiment = res.data.result.type;
                let rating = 1;
                let comContent = commentContent;
                let sentimentClass = `${sentiment.charAt(0).toUpperCase()}${sentiment.slice(1)}`;
                let topic = "Love";
                let userId = 1;
                const today = new Date();
                const formattedDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
                const formattedTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
                let sqlInsertComment = `INSERT INTO comments(rating, comContent, sentimentClass, topic, userId, createTime) 
                                                            VALUES(?, ?, ?, ?, ?, ?)`;
                let values = [rating, comContent, sentimentClass, topic, userId, today];
                // create a json object containing the inserted customer
                let postProcessInsert = function (err, result) {
                    if (err) throw err;  
                    //res.json({id: result.insertId, comContent: comContent, sentimentClass: sentimentClass, topic: topic, userId: userId, today: today, insertedLines: result.affectedRows });
                };
                db.query(sqlInsertComment, values, postProcessInsert);
            })
            .catch((error)=>{
                console.log(error);
            })
        
        // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/insertComm.html');
    });

    app.get('/insComm.js', function(req, res) {
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/js' + '/insComm.js');
    });

    app.get('/insComment', function(req, res) {
        let rating = (req.query.newRating);
        let comContent = (req.query.newComContent);
        let sentimentClass = (req.query.newSentimentClass);
        let topic = (req.query.newTopic);
        let userId = (req.query.userId);
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const formattedTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

        let sqlInsertComment = 'INSERT INTO comments(rating, comContent, sentimentClass, topic, userId, createTime) VALUES(?, ?, ?, ?, ?, ?)';

        let values = [rating, comContent, sentimentClass, topic, userId, today];
        // create a json object containing the inserted customer
        let postProcessInsert = function (err, result) {
            if (err) throw err;  
            res.json({id: result.insertId, rating: rating, comContent: comContent, sentimentClass: sentimentClass, topic: topic, userId: userId, today: today, insertedLines: result.affectedRows });
        };
        db.query(sqlInsertComment, values, postProcessInsert);
    });

}