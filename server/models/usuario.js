
const mongoose = require('mongoose');
const mongoose_unique = require('mongoose-unique-validator');

let rolesValidos =  {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol valido.'
};

//Creacion de los esquemas de los objetos de mongo.
let Schema = mongoose.Schema;

//Schema de usuario.
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        //required: true   Seria asi para mensaje generico, pero lo vamos a personalizar al español
        required: [true, 'El nombre es un campo obligatorio.']
    },
    email: {
        type: String, 
        unique: true,
        required: [true, 'El correo es obligatorio'] 
    },
    password: {
        type: String, 
        required: [true, 'El password es obligatorio.']
    },
    img: {
        required: false,
        type: String
    }, //No es obligatoria
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, //Propiedad default user_rol.
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false
    }, //Boolean.

});

//Vamos a modificar el esquema cuando este intenta imprimirse en JSON, ya que no queremos 
//que la password viaje en los mensajes de respuesta.

usuarioSchema.methods.toJSON = function () {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//Indicamos a mongoose unique que este esquema debe utilizar el plugin
//usuarioSchema.plugin( mongoose_unique );

//Pero lo vamos a configurar para que dispare un mensaje de error.
usuarioSchema.plugin( mongoose_unique, {
    message: '{PATH} debe de ser unico.'
});

//Se exporta el modelo con el nombre Usuario y con el Schema de usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);