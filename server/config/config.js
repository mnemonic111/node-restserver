

//=====================
// Puerto
//=====================
process.env.PORT = process.env.PORT || 3000;

//=====================
// Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
// BBDD
//=====================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

//Metemos la url de la BBDD en el objeto process.
process.env.URLDB = urlDB;

//=====================
// Vencimiento del token
//=====================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



//=====================
// Seed de autenticacion
//=====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
