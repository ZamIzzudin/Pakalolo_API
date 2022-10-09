const mysql = require('mysql');
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

conn.connect((err) => {
    if (err) {
        console.log('error connecting : ' + err.stack);
        return;
    }
    console.log('connection success');
});

module.exports = conn