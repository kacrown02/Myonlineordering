const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',   // Ensure this matches your MySQL root password
  database: 'cupdb', // Ensure the 'cupdb' database exists in MySQL
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
  console.log('MySQL Connected...');
});

module.exports = db;
