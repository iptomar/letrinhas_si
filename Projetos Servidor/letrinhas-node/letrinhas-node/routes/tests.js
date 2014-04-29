/// <reference path="../Scripts/typings/express/express.d.ts" />
/// <reference path="../Scripts/typings/node/node.d.ts" />
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
        //response.type('json');
        //response.end(JSON.stringify({
        //    id: 1,
        //    title: 'Um carrinho bonito',
        //    image: result.toString('base64'),
        //    success: 1
        //}));
        response.end(result);
    });
    console.log("Hello");
}
exports.getImage = getImage;

function postImage(request, response) {
    // console.log(request);
    var correctId = request.body['correct-id'];

    //// Read the file
    //fs.readFile(request.files[correctId].path, (err, data) => {
    //    appPostServices.sendBinaryDataToDb(data, (err) => {
    //        if (err) {
    //            console.log(err);
    //        }
    //        response.end('Whatever');
    //    });
    //});
    // console.log(request.body);
    //fs.readFile(request.files[correctId].path, (err, data) => {
    //    fs.writeFile('D:/' + request.files[correctId].path, data, (err) => {
    //        console.log('Saved file.');
    //    });
    //});
    console.log(correctId);

    console.log(request.files);

    response.end('Whatever');
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
        } else {
            appGetServices.getTestById(idList, function (err, testList) {
                response.json({
                    tests: testList,
                    success: 1
                });
            });
        }
    } else if (request.query.hasOwnProperty('lastSyncDate')) {
    } else {
        response.statusCode = 400;
        response.end("No id supplied.");
    }
}
exports.getTest = getTest;

//função que devolve um teste com perguntas random
function getRandomTest(request, response) {
    //em querystring vem o numero de perguntas que se pretende, o ano e a area
    var num = request.query['num'];
    var year = request.query['ano'];
    var area = request.query['area'];

    if (isNaN(num) || isNaN(year)) {
        response.end("Number or Year invalid.");
    } else {
        appGetServices.getAllRandomTests(num, year, area, function (err, testlist) {
            var sendResult = {
                tests: testlist,
                success: 1
            };

            response.end(JSON.stringify(sendResult));
        });
    }
}
exports.getRandomTest = getRandomTest;

function postTestResults(request, response) {
    // console.log(request.body);
    // TODO: Figure out a structure for the POST. It could be done 1 by 1,
    // or multiple at a time.
    // Fields:
    // * execution-date: The date on which the test was done. String, formatted as dd-mm-yyyy (hh:mm ???)
    // * test-id: The ID of the test. Integer, higher than 0.
    // * student-id: The ID of the student. Integer, higher than 0.
    // * type: String Enum, values: read, multimedia (? Could get the type from the DB)
    // * (If type is multimedia)
    //   * option: The option which was chosen.Integer, values = 1, 2, or 3.
    // * (If type is read):
    //   * observations: Professor observations. String.
    //   * wpm: Words per minute. Number.
    //   * correct: Correct word count: Integer.
    //   * precision: Reading precision. Number.
    //   * speed: Reading speed. Number.
    //   * expressiveness: The student's expressiveness. Number.
    //   * rhythm: The student's rhythm. Number.
    //   * incorrect: Incorrect word count. Integer.
    //   * audio: The audio for the recording. File.
    appPostServices.saveTestsToDb(request).then(function () {
        return response.json({ success: 1 });
    }).catch(function (err) {
        response.statusCode = 500;
        response.json({ success: 0, reason: err.toString() });
    });
    //appPostServices.saveTestsToDb(request, (err) => {
    //    if (err) {
    //        response.statusCode = 500;
    //        console.log(err.message);
    //        response.json({
    //            success: 0
    //        });
    //    } else {
    //        response.json({
    //            success: 1
    //        });
    //    }
    //});
}
exports.postTestResults = postTestResults;
//# sourceMappingURL=tests.js.map
