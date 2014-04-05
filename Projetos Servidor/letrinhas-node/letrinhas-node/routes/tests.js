///reference path="../typings/express/express.d.ts"/>
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
        response.end(result);
    });
}
exports.getImage = getImage;

function postImage(request, response) {
    var correctId = request.body['correct-id'];

    console.log(correctId);

    console.log(request.files[correctId]);

    response.end('Whatever');
}
exports.postImage = postImage;
//# sourceMappingURL=tests.js.map
