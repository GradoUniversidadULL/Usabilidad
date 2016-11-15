var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var mysql = require('mysql'); // Mysql include
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var sess;



var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'test',
});




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ssshhhhh'}));
app.set('port',process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.get('/', function (req, res) {
  res.sendFile('./views/index.html', { root : __dirname});
});

app.get('/registro', function (req, res) {
  res.sendFile('./views/registro.html', { root : __dirname});
});

app.get('/login', function (req, res) {
  res.sendFile('./views/login.html', { root : __dirname});
});

app.get('/home', function (req, res) {
  res.sendFile('./views/pagina/index.html', { root : __dirname});
});

app.get('/pasajero', function (req, res) {
  res.sendFile('./views/pagina/pasajero.html', { root : __dirname,user: req.session.user});
});

app.get('/ruta', function (req, res) {
  res.sendFile('./views/pagina/ruta.html', { root : __dirname,user: req.session.user});
});


app.post('/registro',function(req, res) {
    //query para comprobar si el email ya esta en la BBDD
    console.log("SELECT * FROM USUARIO WHERE nombre='" + req.body.username + "'");
    connection.query("SELECT * FROM USUARIO WHERE nombre='" + req.body.username + "'",function(err, rows, fields){
      console.log(rows);
      if(err){console.log(err)}
      if(rows.length != 0){
        res.sendFile('./views/registro.html', { root : __dirname});
      } else{
        connection.query("INSERT INTO USUARIO (nombre,email,password) VALUES ('" +   req.body.username + '\',\'' + req.body.email + '\',\'' + req.body.password + "\')");
        res.sendFile('./views/index.html', { root : __dirname});
        
      }
    });
});
  
  
app.post('/login',function(req, res) {
    //query para comprobar si el email ya esta en la BBDD
    console.log("SELECT * FROM USUARIO WHERE nombre='" + req.body.username + "'");
    connection.query("SELECT * FROM USUARIO WHERE nombre='" + req.body.username + "' AND password='" + req.body.password + "'",function(err, rows, fields){
      console.log(rows);
      if(err){console.log(err)}
      if(rows.length != 0){
        sess=req.session;

        sess.user = req.body.username; // equivalent to $_SESSION['user'] in PHP.
        res.render('index', {
            user: sess.user
        });
      } else{
        
        res.sendFile('./views/login.html', { root : __dirname});
        
      }
    });
});

app.get('/indexjade',function(req, res) {
    res.render('index', {
            user: req.session.user
        });
});

app.get('/salir',function(req, res) {
    req.session.destroy();
    res.sendFile('./views/index.html', { root : __dirname});
});


  
  
app.post('/aruta',function(req, res) {
    //query para comprobar si el email ya esta en la BBDD
   
        connection.query("INSERT INTO RUTA (name,origen,destino,contacto) VALUES ('" +  req.session.user + '\',\'' + req.body.origen + '\',\'' + req.body.destino + '\',\'' + req.body.contacto + "\')");
        res.redirect('/home');
        
});


app.get('/usuarios',function(req,res){
    var data = {
        "error":1,
        "Usuarios":""
    }; 
    connection.query("SELECT * from users",function(err, rows, fields){
        if(err){console.log(err)};
            if(rows.length != 0){
                data["error"] = 0;
                data["Usuarios"] = rows;
                res.json(data);
            }else{
    			console.log(data);
                data["Usuarios"] = 'No books Found..';
                res.json(data);
            }
        });
});

app.get('/cargar',function(req,res){
  var data = [];
    connection.query("SELECT * from RUTA",function(err, rows, fields){
        if(err){console.log(err)}
            if(rows.length != 0){
                data.push(rows);
                console.log(data)
                res.json(data);
            }else{
          			console.log(data);
                      data.push("No hay rutas todavía");
                      res.json(data);
                  }
        });
});


app.get('/traemelo',function(req,res){
 res.json(guard); 
});


var guard = [];
app.post('/guardpasaj',function(req,res){
  var data = [];
    connection.query("SELECT * from RUTA WHERE  destino='" + req.body.destino + "'",function(err, rows, fields){
        if(err){console.log(err)}
            if(rows.length != 0){
                data.push(rows);
                console.log(data)
                guard = data;
            }else{
          			console.log(data);
                      data.push("No hay rutas todavía");
                      guard = data;
                  }
        });
    res.sendFile('./views/pagina/destino.html', { root : __dirname,user:req.session.user});     
});


app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + '!');
});