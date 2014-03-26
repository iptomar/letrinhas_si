/*jslint devel: true*/
/*global require, module*/
// Contains functions to handle Http requests.

module.exports = {
    handleRequest: function (request, response) {
        
        console.log('Got a request to ' + request.url);
        
        _addCorsHeaders(response);

        switch (request.method) {
            case 'GET':
                switch (request.url) {
                    case '/testList':
                        response.writeHead(200);
                        _fetchTests(response);
                        break;
                    default:
                        _sendNotFound(response);
                        break;
                }
                break;
            case 'POST':
                switch (request.url) {
                    case '/postTestResults':
                        response.writeHead(200);
                        _pushResults(request, response);
                        response.end('Successful.');
                        break;
                    default:
                        _sendNotFound(response);
                }
        }
    }
};

var _addCorsHeaders = function(response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
};

function _fetchTests(response) {
    var returnData = {
        tests: [
            {
                id: 1,
                title: "O capuchinho vermelho",
                text: "Era uma vez...",
                professorName: "Um professor qualquer",
                maxTries: 3
            },
            {
                id: 2,
                title: "A história da Carochinha",
                text: "Sou mesmo mau a lembrar-me de histórias.",
                professorName: "Um professor qualquer",
                maxTries: 2
            }
        ]
    };
    
    response.end(JSON.stringify(returnData));
}

function _pushResults(request, response) {
    var jsonData = '';

    request.on('data', function(chunk) { jsonData += chunk; });

    request.on('end', function() {
        var results = JSON.parse(jsonData);

        var resultList = results.solvedTests;
        
        console.log(results);
    });
}

var _sendNotFound = function(response) {
    response.writeHead(404);
    response.end('Not found!');

    console.log('Sent a 404.');
};
