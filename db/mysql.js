var mysql = require('mysql2');

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset:'utf8mb4'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});