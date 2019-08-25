

//=====================
// Puerto
//=====================
process.env.PORT = process.env.PORT || 3000;

//=====================
// Entorno
//=====================
process.env.NOVE_ENV = process.env.NOVE_ENV === 'dev';

//=====================
// BBDD
//=====================
let urlDB;

if (process.env.NOVE_ENV !== 'production') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://admin:131184ma@cluster0-rg884.mongodb.net/cafe';
}

//Metemos la url de la BBDD en el objeto process.
process.env.URLDB = urlDB;