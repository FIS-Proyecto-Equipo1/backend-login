var express = require('express');
var bodyParser = require('body-parser');

var port = (process.env.PORT || 4000);
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
var users = [
    {"username": "myuser", "password": "mypass", "name": "Roberto Serrano"}
]



app.get("/", (req, res) => {
    res.send("<html><body><h1>Hello World Ma boy</h1></body></html>")
});

app.get(BASE_API_PATH + "/user", (req, res) => {
    res.send(users)
});


app.post(BASE_API_PATH + "/login", (req, res) => {
    userVM = req.body;
    var foundUser;
    users.forEach( _user => {
        // console.log("Hi")
        if( _user.username === userVM.username && _user.password === userVM.password){
            foundUser = _user
        }
    });


    // for(i = 0; i < users.length; i++ ){
    //     console.log("Hi")
    //     if( users[i].username === userVM.username && users[i].password === userVM.password){
    //         foundUser = users[i]
    //     }
    // }

    if(foundUser){
        res.send("{'token': '"+tokenExample+"'}");
    }else{
        res.sendStatus(400).send("{'error':'No existe'}");
    }
    
});

app.post(BASE_API_PATH + "/login", (req, res) => {
    userVM = req.body;
    var foundUser;
    users.forEach( _user => {
        if( _user.username === userVM.username && _user.password === userVM.password){
            foundUser = _user
        }
    });


    // for(i = 0; i < users.length; i++ ){
    //     console.log("Hi")
    //     if( users[i].username === userVM.username && users[i].password === userVM.password){
    //         foundUser = users[i]
    //     }
    // }

    if(foundUser){
        res.send("{'token': 'asdqweadsaweqwdas'}");
    }else{
        res.send(400,"{'error':'No existe'}");
    }
    
});


app.get(BASE_API_PATH + "/logged-user", (req, res) => {
    _auth = req.header('Authentication')
    if(_auth == tokenExample){
        res.send(users[0]);
    }
    res.send(401,"{'error':'Not valid'}")
});


app.listen(port);