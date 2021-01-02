var express = require('express');
var bodyParser = require('body-parser');
const User = require('./login');

var BASE_API_PATH = "/api/v1"

console.log("Starting Auth service...")


var app = express();
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



var tokenExample = "asdqweadsaweqwdas";
// var users = [
//     {"username": "myuser", "password": "mypass", "name": "Roberto Serrano"}
// ]



app.get("/", (req, res) => {
    res.send("<html><body><h1>Login OK</h1></body></html>")
});

app.get(BASE_API_PATH + "/user", (req, res) => {
    console.log(Date() + " - GET /user");
    User.find({}, (err, users) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        }
        else {
            res.send(users.map((user) => {
                return users.cleanup();
            }));
        }
    });
});

app.post(BASE_API_PATH + "/user", (req, res) => {
    console.log(Date() + " - POST /user");
    var contact = req.body;
    User.create(contact, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500) // error 500. error interno
        }
        else {
            res.sendStatus(201); // Codigo de estado de elemento creado
        } 
    });
});

app.post(BASE_API_PATH + "/login", (req, res) => {
    userVM = req.body;
    var foundUser;
    users.forEach( _user => {
        if( _user.username === userVM.username && _user.password === userVM.password){
            foundUser = _user
        }
    });

    if(foundUser){
        res.send("{'token': '"+tokenExample+"'}");
    }else{
        res.sendStatus(400).send("{'error':'No existe'}");
    }
    
});

app.get(BASE_API_PATH + "/logged-user", (req, res) => {
    _auth = req.header('Authentication')
    if(_auth == tokenExample){
        res.send(users[0]);
    }
    res.send(401,"{'error':'Not valid'}")
});

module.exports = app;