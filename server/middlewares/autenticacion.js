// **************************
// Verificar Token
// **************************

const jwt = require('jsonwebtoken');

//Los middlewares , como este son funciones que reciben tres parametros. 
// la request, el response y el next, que hará que continue el programa.
let verificaToken = (req, res, next) => {

    //Leemos el token, que viene en la cabecera.
    let token = req.get('Authorization');

    //verificamos el token con la libreria JWT.
    //Este recibe el token, el SEED y un callback el cual a su vez recibe:
    // un error y un decoded.
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        //Si algo sale mal, si el token expiró, o se modificó ... el error sale de la ejecuión
        // y este no ejecuta nada.
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token invalido. Peticion no autorizada.',
                err
            });
        }

        //EN caso de que el token sea valido, lo que vamos a enviar es el objeto usuario de decoded, 
        //el cual 
        //es el propio usuario.
        req.usuario = decoded.usuario;
        
        //llamamos al metodo next, que permitirá que continue la ejecucion del codigo.
        next();

    });
};

/**
 * Verifica que el rol del usuario sea ADMIN_ROLE
 * @param {request} req 
 * @param {response} res 
 * @param {funcion} next 
 */
let verificaAdmin = (req, res, next) => {

        let usuarioRol = req.usuario.rol;

        if (usuarioRol !== 'ADMIN_ROLE') {
            return res.status(401).json({
                ok: false,
                message: 'Debe ser administrador para poder realizar esta operación.'
            });
        }

        next();

};


//Exportamos.
module.exports = {
    verificaToken,
    verificaAdmin
}