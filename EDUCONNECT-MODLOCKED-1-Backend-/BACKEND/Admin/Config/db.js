// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '12345678', // Your MySQL password
    database: 'university_management' // Your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database');
});

module.exports = db;
