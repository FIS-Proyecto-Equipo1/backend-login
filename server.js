var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Usuarios = require('./login');

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



app.get("/", (req, res) => {
    res.send("<html><body><h1>Login OK</h1></body></html>")
});


app.post(BASE_API_PATH + "/user", (req, res) => {
    console.log(Date() + " - POST Create user");
    var nuevoUsuario = req.body;
    generatedSalt = bcrypt.genSaltSync(10);
    nuevoUsuario.password = bcrypt.hashSync(nuevoUsuario.password, generatedSalt)
    Usuarios.create(nuevoUsuario, (err) => {
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
    console.log(Date() + " - POST Login request")
    username = req.body.username;
    password = req.body.password;

    Usuarios.findOne({ email: username }, (erro, usuarioDB)=>{
        if (erro) {
          return res.status(500).json({
             err: erro
          })
       }
    // Verifica que exista un usuario con el mail escrita por el usuario.
      if (!usuarioDB) {
         return res.status(400).json({
           err: {
               message: "Usuario o contraseña incorrectos"
           }
        })
      }
    // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
      if (! bcrypt.compareSync(password, usuarioDB.password)){
         return res.status(400).json({
            err: {
              message: "Usuario o contraseña incorrectos"
            }
         });
      }

      var token = jwt.sign({ 'userId': usuarioDB._id, 'role': usuarioDB.rol }, tokenSignKey);
      var result = { "token": token, "rol": usuarioDB.rol}
      res.send(result);
    });

    
});


app.get(BASE_API_PATH + "/login", (req, res) => {
    console.log(Date() + " - GET Logged user")
    var token = req.headers.authorization.split(" ")[1];
    try {
        var decoded = jwt.verify(token, tokenSignKey);
    } catch(err) {
        console.log(err)
        res.status(401).send("{'error':'Not valid'}")
        return
    }
    console.log(decoded)
    Usuarios.findOne({ _id: decoded.userId }, (erro, usuarioDB)=>{
        if (erro) {
          return res.status(500).json({
             err: erro
          })
       }

       if(usuarioDB){
            return res.send(usuarioDB);
       }else{
        return res.status(401).send("{'error':'Not found'}")
       }


    }
    );
});





app.get(BASE_API_PATH + "/user", (req, res) => {
    console.log(Date() + " - GET All users")
    var token = req.headers.authorization.split(" ")[1];
    let loggedUserRole = req.header("x-rol")

    if(loggedUserRole != "ADMIN"){
        return res.status(403).send("{'error':'Unathorized'}")
    }
    Usuarios.find( (erro, usuariosDB)=>{
        if (erro) {
          return res.status(500).json({
             err: erro
          })
       }

       if(usuariosDB){
            return res.send(usuariosDB);
       }else{
        return res.status(401).send("{'error':'Not found'}")
       }


    }
    );
});


app.put(BASE_API_PATH + "/user/:id_user", (req, res) => {
    let userId = req.params.id_user;
    console.log(Date() + " - PUT Update user " + userId)
    

    let loggedUserId = req.header("x-user")
    let loggedUserRole = req.header("x-rol")

    if(!loggedUserRole || !loggedUserRole){
        return res.status(403).send("{'error':'Unauthorized'}")
    }

    if(loggedUserRole != "ADMIN" && loggedUserId != userId){
        return res.status(401).send("{'error':'Unauthorized'}")
    }

    let usuarioActualizado = req.body
    delete usuarioActualizado.userId

    if(loggedUserRole != "ADMIN"){
        delete usuarioActualizado.rol
    }

    Usuarios.findOneAndUpdate({_id: userId}, usuarioActualizado, (erro, usuarioDB)=>{

        if (erro) {
            return res.status(500).json({
               err: erro
            })
         }else{
            return res.send(usuarioDB);
         }
    }

    );
});





app.get(BASE_API_PATH + "/user/:id_user", (req, res) => {
    let userId = req.params.id_user;
    
    console.log(Date() + " - Get User :" + userId)

    let loggedUserId = req.header("x-user")
    let loggedUserRole = req.header("x-rol")

    if(loggedUserRole && loggedUserRole != "ADMIN" && loggedUserId && loggedUserId != userId){
        return res.status(401).send("{'error':'Not found a'}")
    }
    
    Usuarios.findOne({ _id: userId }, (erro, usuarioDB)=>{
        if (erro) {
          return res.status(500).json({
             err: erro
          })
       }

       if(usuarioDB){
            return res.send(usuarioDB);
       }else{
        return res.status(401).send("{'error':'Not found'}")
       }


    }
    );
});

module.exports = app;