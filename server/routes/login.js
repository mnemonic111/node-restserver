const express = require('express');

//Herramientas para cifrado de informacion.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();


/**
 * Login que nos devuelve el token de usuario para el login.
 */
app.post('/login',  (req, res) => {

    //Lo primero que haremos es recibir el login y el password.
    let body = req.body;
    
    //Buscamos al usuario por clave primaria.
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        //Verificamos si existe error:
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Verificamos si existe el usuario:
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '*Usuario* o contraseña invalida'
                }
            });
        }

        //Si existe comprobamos la password.
        //Para comparar la password, vamos a utilizar una funcion de bcrypt que nos devuelve 
        //true o false en funcion de si coinciden o no las passwords.
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            //Si entra aquí es la que la password del usuario NO es correcta.
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o *contraseña* invalida'
                }
            });
        }

        //Generamos el token para el usuario.
        let token = jwt.sign({
            usuario: usuarioBD
        }, 'este-es-el-seed-desarrollo', {expiresIn: process.env.CADUCIDAD_TOKEN}); //Expira en 30 dias.


        //Si todo es correcto y no hemos salido de la ejecucion, vamos a generar el token.
        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token //Como es igual el nombre de objeto response que la variable let ... no hace falta igualar
        });

    });
    
})

//Exportacion del modulo
module.exports = app;