const mariadb = require('mysql');
const connection = mariadb.createConnection({
  host: 'localhost',
  user: 'root',
  connectionLimit: 5,
  password: '1111',
  database: 'testbox'
});

connection.connect();

connection.query('SELECT * FROM data_test', function(error, results, fields){
if(error) {
console.log(error);
};
console.log(results);
});

connection.end();
