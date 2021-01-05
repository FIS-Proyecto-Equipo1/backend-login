var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const User = require('./login');

var BASE_API_PATH = "/api/v1"

console.log("Starting Auth service...");

var app = express();
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


  var tokenSignKey = (process.env.SIGN_KEY || '669B523BBC1157221D3AAA35E8398');

//** Eliminar cuando se haga con conexión a la bbdd  - INICIO */
var users = [
    {"userId": 1, "email":"admin@gmail.com", "rol":"ADMIN", "password": "mypass", "nombre": "Roberto", "apellidos": "Serrano", "telefono":"655656565", "cuentaBancaria":"ES91 2100 0418 4502 0005 1332"},
    {"userId": 2, "email":"user@gmail.com", "rol":"USER", "password": "mypass", "nombre": "Juan Luis", "apellidos": "Montes", "telefono":"668858585", "cuentaBancaria":"ES91 2100 0418 4502 0005 1332"}
]

const loginUser = function(username, password){
    var foundUser;
    users.forEach( _user => {
        if( _user.email === username && _user.password === password){
            foundUser = _user
        }
    });
    return foundUser
};

const retrieveUser = function(userId){
    var foundUser;
    users.forEach( _user => {
        if( _user.userId === userId){
            foundUser = _user
        }
    });
    return foundUser
};

//** Eliminar cuando se haga con conexión a la bbdd  - FIN */



app.get("/", (req, res) => {
    res.send("<html><body><h1>Login OK</h1></body></html>")
});

// app.get(BASE_API_PATH + "/user", (req, res) => {
//     console.log(Date() + " - GET /user");
//     User.find({}, (err, users) => {
//         if (err) {
//             console.log(Date() + " - " + err);
//             res.sendStatus(500);
//         }
//         else {
//             res.send(users.map((user) => {
//                 return users.cleanup();
//             }));
//         }
//     });
// });

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
    console.log("Login post request")
    userVM = req.body;
    var foundUser = loginUser(userVM.username, userVM.password);

    if(foundUser){
        var token = jwt.sign({ 'userId': foundUser.userId, 'role': foundUser.rol }, tokenSignKey);
        var result = { "token": token, "rol": foundUser.rol}
        res.send(result);
    }else{
        res.status(400).send("{'error':'No existe'}");
    }
    
});

app.get(BASE_API_PATH + "/logged-user", (req, res) => {
    _auth = req.header('Authorization')
    try {
        var decoded = jwt.verify(_auth, tokenSignKey);
    } catch(err) {
        res.send(401,"{'error':'Not valid'}")
        return
    }
    console.log(decoded)
    var foundUser = retrieveUser(decoded.userId);
    if(foundUser){
        res.send(foundUser);
        return
    }
    res.send(401,"{'error':'Not found'}")
});

app.get(BASE_API_PATH + "/user", (req, res) => {
    console.log("Logged user request")
    var token = req.headers.authorization.split(" ")[1];
    try {
        var decoded = jwt.verify(token, tokenSignKey);
    } catch(err) {
        console.log(err)
        res.status(401).send("{'error':'Not valid'}")
        return
    }
    console.log(decoded)
    var foundUser = retrieveUser(decoded.userId);
    if(foundUser){
        res.send(foundUser);
        return
    }
    res.send(401,"{'error':'Not found'}")
});


app.get(BASE_API_PATH + "/user/1", (req, res) => {
    console.log("Logged user request")
    var token = req.headers.authorization.split(" ")[1];
    try {
        var decoded = jwt.verify(token, tokenSignKey);
    } catch(err) {
        console.log(err)
        res.status(401).send("{'error':'Not valid'}")
        return
    }
    console.log(decoded)
    var foundUser = retrieveUser(decoded.userId);
    if(foundUser){
        res.send(foundUser);
        return
    }
    res.send(401,"{'error':'Not found'}")
});

module.exports = app;