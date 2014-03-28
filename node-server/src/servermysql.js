/*global require*/
/*jshint devel: true*/
/*jslint devel: true*/
/*global require, module, Buffer*/


module.exports = {
    getTests: _fetchTests,
    postResults: _postResults
};

// Import da biblioteca mysql
var mysql = require('mysql');

// Criar a ligação ao servidor
var pool  = mysql.createPool({
        host     : '192.168.56.101',
        user     : 'psiapp',
        password : 'psiapp',
        database : 'letrinhas'
});

/**
 * @private
 * Description Fetches tests from the database.
 * @param {http.ServerResponse} response
 */
function _fetchTests(response) {
    // Query
    pool.query('SELECT * from Testes;', function(err, rows, fields) {
        // Verificar se existem erros
        if (err) { 
            console.log(err);
            _sendError(response);
        } else {
            // Tudo está ok. Vamos construir a resposta...
            var result = {
                tests: [],
                success: 1
            };
            
            for (var i = 0; i < rows.length; i++) {
                result.tests.push({
                    id: rows[i].id,
                    title: rows[i].title,
                    text: rows[i].textContent.toString(),
                    professorName: rows[i].professorName,
                    maxTries: rows[i].maxTries
                });
            }
            
            // E enviá-la para o cliente!
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify(result));
        }
    });   
}


/**
 * @private
 * Description Posts results to the database.
 * @param {Object} json The data to save.
 * @param {http.ServerResponse} response The response on which to answer if things went well.
 */
function _postResults(json, response) {
    // Obter uma ligação
    pool.getConnection(function (connectionError, connection) {
        // Verificar se existem erros ao obter a ligação
       if (connectionError) { 
           console.log(connectionError); 
           _sendError(response);
       } else {
           // Ligação OK.
           var list = json.solvedTests;
           
           var insertData = {
               testId: list[0].testId,
               completionDate: list[0].completionDate,
               studentName: list[0].studentName,
               voiceData: new Buffer(list[0].voiceBase64, 'base64').toString('utf-8')
           };
           
           // Fazer o INSERT
           var query = connection.query('INSERT INTO Resolucoes SET ?', insertData, function(insertError, result) {
               console.log(query.sql);
               
               // Verificar se houveram erros no INSERT
               if (insertError) {
                   console.log(insertError);
                   _sendError(response);
               } else {
                   // Tudo OK. Vamos enviar para o cliente.
                   console.log(result);
                   response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                   response.end('{"success": 1}');
               }
           });
       }
    });
}

/// Sends an error down an HttpResponse, and closes it.
function _sendError(response) {
    response.writeHead(500);
            
    response.end('{"success": 0}');
}