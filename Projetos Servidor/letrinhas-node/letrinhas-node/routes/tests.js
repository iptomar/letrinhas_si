///reference path="../typings/express/express.d.ts"/>
var fs = require('fs');

var appPostServices = require('../Scripts/services/appPostServices');
var appGetServices = require('../Scripts/services/appGetServices');

function listSummary(request, response) {
    var max = parseInt(request.param('max'));

    max = isNaN(max) ? null : max;

    appPostServices.getTestListSummaryFromDb(max, function (err, list) {
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
            data: result.toString('base64')
        }));
        // response.end(result);
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
//# sourceMappingURL=tests.js.map
