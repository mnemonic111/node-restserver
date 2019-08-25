const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./config/config');
require('./routes/usuario');

const app = express();


//Configuracion de body-parser, para poder leer payload de las peticiones post
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 // parse application/json
app.use(bodyParser.json());

//Aniadimos las rutas de usuarios.
app.use( require('./routes/usuario') );

 
//Conexion a la BBDD y configuraciones necesarias.
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect( process.env.URLDB ,{useNewUrlParser: true})
.then( ok => {
    console.log('Conexión BBDD realizada con Exito.');
}).catch(err => {
    console.error(err);
});

app.listen(process.env.PORT, () => {
    console.log('Escchando en el puerto ', process.env.PORT);
});