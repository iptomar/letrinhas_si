var syncServices = require('../Scripts/services/syncServices');

function getProfessors(request, response) {
    syncServices.getProfessors(function (err, data) {
        if (err) {
            response.statusCode = 500;
            response.json({
                professors: []
            });
            return;
        }

        response.json({
            professors: data
        });
    });
}
exports.getProfessors = getProfessors;
//# sourceMappingURL=sync.js.map
