const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');

const app = express();


//Configuracion de body-parser, para poder leer payload de las peticiones post
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 // parse application/json
app.use(bodyParser.json());

 
app.get('/usuario', function (req, res) { 
    //Debido a que vamos a crear un RESTServer , podemos cambiar el send por json.
    //El cual convierte la información automaticamente a JSON.
  res.json('get Usuario');
});

app.post('/usuario', function (req, res) { 
    //Debido a que vamos a crear un RESTServer , podemos cambiar el send por json.
    //El cual convierte la información automaticamente a JSON.

    let body = req.body;

    if (body.nombre === undefined ) {
        //Vamos a enviar un codigo de error debido a que no se encuentra el nombre.
        //Se puede dejar el json vacio si no queremos enviar mas informacion al usuario, 
        //o completarla lcon la informacion que queramos.
        //En este caso enviaremos un json con el error.
        //res.status(400).json();
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario',
            error: 'Error'
        });
    } else {

    }

  res.json({
      persona: body
  });
});

//Actualizar un usuario, para marcar un parametro por la URL se usa de la siguiente manera:
// :id
app.put('/usuario/:id', function (req, res) { 
    //Para recibir el parametro se puede realizar de la siguiente manera:
    let idUsuario = req.params.id;

    //Debido a que vamos a crear un RESTServer , podemos cambiar el send por json.
    //El cual convierte la información automaticamente a JSON.
  res.json({
      idUsuario,
      operacion: 'put usuario'
  });
});

app.delete('/usuario', function (req, res) { 
    //Debido a que vamos a crear un RESTServer , podemos cambiar el send por json.
    //El cual convierte la información automaticamente a JSON.
  res.json('delete Usuario');
});


 
app.listen(process.env.PORT, () => {
    console.log('Escchando en el puerto ', process.env.PORT);
});