/*global require*/
/*jshint devel: true*/
/*jslint devel: true*/
/*global require, module*/

//-- Tarefas a realizar neste ficheiro:
// criar modulo export
//encapsular as pools, de modo a que quando o servidor recebe um get utilize a pool com a query de SELECT, quando recebe um post utilize a pool de insert
//Nota: muito semelhante ao que esta no DART


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
        console.log('GET profs?');
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


        console.log('JSON-Result: ', text);

        response.end(text);
    });
    
    
}






////Seleciona a base de dados
//
//pool.query('SELECT Nome as "Nome do Professor" from Professores as solution;' ,function(err, rows, fields) {
//  if (err) throw err;
//    
//    //imprimir os registos da base de dados
//    for (var i = 0; i < rows.length; i++) {
//        console.log(rows[i]['Nome do Professor']);   
//    }
//
//  // console.log('Professores na BD ', rows[0].solution);
//});
//
////INSERT TO BD
//pool.getConnection(function(err, connection) {
//    var professor  = {Id: 3, User: 'jc1990', Nome: 'Joni Correia'};
//    var query = connection.query('INSERT INTO Professores SET ?', professor, function(err, result) {
//        console.log(query.sql);
//    });
//});
