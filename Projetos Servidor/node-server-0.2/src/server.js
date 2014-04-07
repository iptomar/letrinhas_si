/*jslint devel: true*/
/*global require, module*/
// Contains functions to handle Http requests.

var _sqlserver = require ("./servermysql.js");


module.exports = {
  handleRequest: _handleRequest
};

function _handleRequest(request, response) {
  console.log('Got a request to ' + request.url);

  _addCorsHeaders(response);

  switch (request.method) {
    case 'GET':
      switch (request.url.replace('?', '')) {
        case '/getTestTitles':
          _sqlserver.getTestTitles(response);
          break;            
        case '/getSelectedTest':
          _sqlserver.getSelectedTest(request,response);
            //aqui ha um bug, ele não aceita a querystring, logo, para funcionar tive de por no default. BUG A CORRIGIR  
          break;      
        default:
         _sqlserver.getSelectedTest(request,response);
          break;
      }
      break;
    case 'POST':
      switch (request.url.replace('?', '')) { 
        case '/postTestResults':
          _pushResults(request, response);
          break;
        default:
         
      }
  }
}


var _addCorsHeaders = function(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
};

function _pushResults(request, response) {
  var jsonData = '';

  request.on('data', function(chunk) { jsonData += chunk; });

  request.on('end', function() {
    var results = JSON.parse(jsonData);

    console.log(results);

    _sqlserver.postResults(results, response);
  });
}

var _sendNotFound = function(response) {
  response.writeHead(404);
  response.end('Not found!');

  console.log('Sent a 404.');
};