///reference path="../typings/express/express.d.ts"/>
var fs = require('fs');

var appPostServices = require('../Scripts/services/appPostServices');
var appGetServices = require('../Scripts/services/appGetServices');

function listSummary(request, response) {
    var max = parseInt(request.param('max'));

    max = isNaN(max) ? null : max;

    appGetServices.getTestListSummaryFromDb(max, function (err, list) {
        response.set('Content-Type', 'application/json');
        response.charset = 'utf-8';
        if (err) {
            response.statusCode = 500;
            response.send(JSON.stringify({
                success: 0,
                reason: err.message
            }));
        } else {
            response.send(JSON.stringify({
                tests: list,
                success: 1
            }));
        }
    });
}
exports.listSummary = listSummary;

function getImage(request, response) {
    appGetServices.getBinaryData(function (err, result) {
        response.type('json');
        response.end(JSON.stringify({
            id: 1,
            title: 'Um carrinho bonito',
            image: result.toString('base64'),
            success: 1
        }));
        //response.end(result);
    });
}
exports.getImage = getImage;

function postImage(request, response) {
    var correctId = request.body['correct-id'];

    // Read the file
    fs.readFile(request.files[correctId].path, function (err, data) {
        appPostServices.sendBinaryDataToDb(data, function (err) {
            if (err) {
                console.log(err);
            }

            response.end('Whatever');
        });
    });

    console.log(correctId);

    console.log(request.files[correctId]);
}
exports.postImage = postImage;

function teste(request, response) {
    console.log(request.url);

    response.render('teste', {
        title: "Isto é um teste",
        pessoa: "André Carvalho"
    });
}
exports.teste = teste;

function getTest(request, response) {
    if (request.query.hasOwnProperty('id')) {
        var idListAsString = request.query['id'].split(',');
        var idList = [];

        for (var i = 0; i < idListAsString.length; i++) {
            var id = parseInt(idListAsString[i]);

            if (!isNaN(id)) {
                idList.push(id);
            }
        }

        if (idList.length == 0) {
            response.statusCode = 400;
            response.end('No valid id supplied.');
        }

        appGetServices.getTestById(idList, function (err, testList) {
            var sendResult = {
                tests: testList,
                success: 1
            };

            response.end(JSON.stringify(sendResult));
        });
    } else {
        response.statusCode = 400;
        response.end("No id supplied.");
    }
}
exports.getTest = getTest;

function postTestResults(request, response) {
    appPostServices.saveTestsToDb(request.body, function (err) {
        if (err) {
            response.statusCode = 500;
            console.log(err.message);

            response.end(JSON.stringify({
                success: 0
            }));
        } else {
            response.end(JSON.stringify({
                success: 1
            }));
        }
    });
}
exports.postTestResults = postTestResults;
//# sourceMappingURL=tests.js.map
