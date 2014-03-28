/*global require*/
/*jshint devel: true*/
/*jslint devel: true*/
/*global require, module*/


//cria conecção com o servidor
var mysql = require('mysql');
var pool  = mysql.createPool({
        host     : '192.168.56.101',
        user     : 'psiapp',
        password : 'psiapp',
        database : 'letrinhas'
});
 

module.exports = {
    getResponse: function(response){
        _fetchTests(response);
    }    
};


function _fetchTests(response){
  
    pool.query('SELECT * from Testes as solution;' ,function(err, rows, fields){
        if (err) throw err;

        //imprimir os registos da base de dados
        for (var i = 0; i < rows.length; i++) {
            console.log(rows[i]);   

        }
        response.writeHead(200, { 
            'Content-Type': 'application/json; charset=utf-8',
        });
        var text = JSON.stringify(rows);
        response.end(text);
    });
    
    
}

////INSERT TO BD
//pool.getConnection(function(err, connection) {
//    var professor  = {Id: 3, User: 'jc1990', Nome: 'Joni Correia'};
//    var query = connection.query('INSERT INTO Professores SET ?', professor, function(err, result) {
//        console.log(query.sql);
//    });
//});
