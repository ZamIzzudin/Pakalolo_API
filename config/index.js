const mysql = require('mysql');

// const conn = mysql.createConnection({
//     host: 'sql6.freesqldatabase.com',
//     user: 'sql6490978',
//     password: 'ijUktq1qmU',
//     database: 'sql6490978',
//     port: 3306
// })

const conn = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6495309',
    password: 'TvtD7EgtRF',
    database: 'sql6495309',
    port: 3306
})

conn.connect((err) => {
    if (err) {
        console.log('error connecting : ' + err.stack);
        return;
    }
    console.log('connection success');
});

module.exports = conn