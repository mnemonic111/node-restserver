/**
 * Arvchivo que contiene todas las rutas
 */
const express = require('express');

const app = express();



 //Aniadimos las rutas de usuarios.
app.use( require('./usuario') );

//Aniadimos las rutas de login.
app.use( require('./login') );


//Exportamos app.
module.exports = app;