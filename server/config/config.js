

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

console.log(`Cadena de conexion: ${process.env.NOVE_ENV}`);
if (process.env.NOVE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

//Metemos la url de la BBDD en el objeto process.
process.env.URLDB = urlDB;