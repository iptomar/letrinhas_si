///reference path="../typings/express/express.d.ts"/>
var appPostServices = require('../Scripts/services/appPostServices');

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
            response.send(JSON.stringify(list));
        }
    });
}
exports.listSummary = listSummary;
//# sourceMappingURL=tests.js.map
