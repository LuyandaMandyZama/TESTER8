const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LuyandaZama14',
    database: 'expensetracker',
    connectTimeout: '100000'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL.');
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.code);
        return;
    }
    console.log('Connected to database.');

    connection.end();
});

module.exports = connection;