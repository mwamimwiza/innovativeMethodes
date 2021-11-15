// init server
let express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios')

let app = express();

app.use(express.static(__dirname + '/'));
//app.set('views', __dirname + '/components/views');
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// database configuration
let mysql = require('mysql');

let db = mysql.createConnection(
{
  host: 'localhost',
  port: 6666,
  user: 'mamp',
  password: 'chananas',
  database: 'plantery'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

// load routes: define controller which act on db
let routes = require('./components/routes.js');
routes(app, db, axios);

app.use('/images', express.static('images'));
app.use('/controllers', express.static('components/controllers'))
app.use('/views', express.static('components/views'))

// run server  
app.listen(3000);