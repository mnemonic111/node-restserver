const express = require('express');

//Herramientas para cifrado de informacion.
const bcrypt = require('bcrypt');

//Iincluimos _ como nombre ya que es el standar, es una libreria que tiene muchas funciones que 
//JS debería de tener por defecto, para objetos y demas.
const _ = require('underscore'); 


//Importamos el modelo de Usuario
//Ponemos la U en mayusucla por conveccion, ya que se aqui se crearan clases.
const Usuario = require('../models/usuario');

//Importamos los middlewares personalizados
const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');

const app = express();

/**
 * Devuelve los usuarios.
 */
app.get('/usuario', verificaToken ,(req, res) => { 

    //De cara a la paginacion, vamos a implementar el desde hasta . 
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    let estado = req.query.estado || true;

    //Se realizan las busquedas como lo hariamos en MongoDB.
    //Todas las funciones de mongoose devuelven error o el resultado , como hasta ahora estamos 
    //haciendo.
    //Despues de las condiciones podemos especificar que campos del objeto queremos devolver.
    Usuario.find({estado: estado}, 'nombre email rol estado img')
    .skip(desde) //Funcion que salta los registros que indiquemos.
    .limit(limite) //Queremos 5 usuarios siguiente, para la paginacion.
    .exec( (err, resultado) => {
      
      if (err) {
        return res.status(400).json({
            ok: false,
            err
        });
      }

      //Vamos a incluir el conteo de los registros devueltos por MongoDB.
      //No es buena practica, ya que podríamos hacer un length a la lista 
      //devuelta , pero lo haremos asi para practicar.

      Usuario.count({estado: estado}) //Solo contamos los usuarios activos.
      .limit(limite)
      .skip(desde)
      .exec( (err, contadorRegistros ) => {

          //En caso de que todo vaya bien devolvemos el resultado.
          res.json({
            ok: true,
            num_registros: contadorRegistros,
            activo: estado,
            usuarios: resultado
          });

      })

    
    });

    //Debido a que vamos a crear un RESTServer , podemos cambiar el send por json.
    //El cual convierte la información automaticamente a JSON.
    //res.json('get Usuario');
});

/**
 * Crea un nuevo usuario.
 */
app.post('/usuario', [verificaToken, verificaAdmin], (req, res) => { 
    //Debido a que vamos a crear un RESTServer , podemos cambiar el send por json.
    //El cual convierte la información automaticamente a JSON.

    let body = req.body;

    //Creamos un nuevo objeto de tipo usuario.
    let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      //Aniadimos el cifrado de password.
      //Primer campo es el texto en claro que queremos cifrar y el segundo el numero de vueltas (salt)
      // que queremos realizar en el proceso de cifrado.
      password: bcrypt.hashSync(body.password, 10),
      rol: body.rol,
      img: body.img,
      estado: body.estado,
    })

    usuario.save((err, usuarioDB) => {
      if (err) {
        //Vamos a enviar un codigo de error debido a que no se encuentra el nombre.
        //Se puede dejar el json vacio si no queremos enviar mas informacion al usuario, 
        //o completarla lcon la informacion que queramos.
        //En este caso enviaremos un json con el error.
        //res.status(400).json();
        return res.status(400).json(err);
      } 

        //Eliminamos el password de la respuesta ya que el cliente no tiene porq saberlo.
        //usuarioDB.password = null;

        res.status(200).json({
          status: 'ok',
          usuario: usuarioDB
        });
    });
});

//Actualizar un usuario, para marcar un parametro por la URL se usa de la siguiente manera:
// :id
app.put('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => { 
    //Para recibir el parametro se puede realizar de la siguiente manera:
    let idUsuario = req.params.id;

    //Con underscore recuperamos las propiedades del objeto body que queremos, para que no puedan 
    //actualizar campos como el password o google ... que deberían de hacerse por otro medio.
    // Asi no tenemos que estar con el delete de mil campos...
    let body =_.pick( req.body, ['nombre','email','img','rol','estado'] );

    //Vamos a actualizar el usuario con el esquema. 
    //Recibe los parametros del id que vamos a modificar, el body completo por el momento y 
    //el calback que vamos a utilizar para ver si todo fue ok.
    //Hemos puesto la opción new , para que retorne el nuevo usuario, se puede quitar
    // y retorna el objeto antiguo.
    //Adicionalmente tambien indicamos que corran las validaciones, asi evitamos que 
    // se salten las validaciones puestas en el esquema.
    Usuario.findByIdAndUpdate(idUsuario, body,{new: true, runValidators:true} 
      ,(err, usuarioBD) => {

      //Si existe un error, lo tratamos como anteriormente en el metodo POST.
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      //Si todo va ok..
      res.json({
            ok: true,
            usuarioBD
        });
    });

    //Debido a que vamos a crear un RESTServer , podemos cambiar el send por json.
    //El cual convierte la información automaticamente a JSON.
  
});


/**
 * Elimina logicamente un usuario
 */
app.delete('/usuario/:id', [verificaToken,  verificaAdmin], (req, res) => { 

    let idUsuario = req.params.id;
    //Eliminado lógico , que es el que se va a realizar.
    Usuario.findByIdAndUpdate( idUsuario , {estado: false}, {new: true} ,(err, usuarioModificado) => {

      //Si hay error lo enviamos.
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      //Verificamos si existe el usuario
      if (!usuarioModificado) {
        return res.status(400).json({
          ok: false,
          message: 'El usuario no existe'
        });
      }

      //En caso contrario, si todo va correctamente enviamos el usuario modificado.
      console.log('ok');
      res.status(200).json({
        ok: true, 
        usuario_eliminado: usuarioModificado
      });
      
    });
    
});

//Exportaciones de variables / metodos.
module.exports = app;