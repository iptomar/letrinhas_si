/*global require*/
/*jshint devel: true*/

var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : '194.210.241.252',
  user     : 'psiapp',
  password : 'psiapp',
    database: 'letrinhas'
});


/* SELECT A BD*/

pool.query('SELECT Nome as "Nome do Professor" from Professores as solution;' ,function(err, rows, fields) {
  if (err) throw err;
    
    for (var i = 0; i < rows.length; i++) {
        console.log(rows[i]['Nome do Professor']);   
    }

  // console.log('Professores na BD ', rows[0].solution);
});

/*INSERT TO BD*/
pool.getConnection(function(err, connection) {
    var professor  = {Id: 3, User: 'jc1990', Nome: 'Joni Correia'};
    var query = connection.query('INSERT INTO Professores SET ?', professor, function(err, result) {
        console.log(query.sql);
    });
});    

