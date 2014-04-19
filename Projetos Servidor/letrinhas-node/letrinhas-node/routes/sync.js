var syncServices = require('../Scripts/services/syncServices');

/**
* Gets all the professors from the DB, and sends them
* down the request.
*
* If an error happens, the list will be empty and a 500 is sent.
*/
function getProfessors(request, response) {
    syncServices.getProfessors(function (err, professors) {
        if (err) {
            response.statusCode = 500;
            response.json({
                professors: []
            });
            return;
        }

        response.json({
            professors: professors
        });
    });
}
exports.getProfessors = getProfessors;

/**
* Gets all the schools from the DB, and sends them down the request.
*
* If an error happens, the list will be empty and a 500 is sent.
*/
function getSchools(request, response) {
    syncServices.getSchools(function (err, schools) {
        if (err) {
            response.statusCode = 500;

            response.json({
                schools: []
            });
            return;
        }

        response.json({
            schools: schools
        });
    });
}
exports.getSchools = getSchools;

function getClasses(request, response) {
    syncServices.getClasses(function (err, classes) {
        if (err) {
            response.statusCode = 500;

            response.json({
                classes: []
            });
            return;
        }

        response.json({
            classes: classes
        });
    });
}
exports.getClasses = getClasses;

function getStudents(request, response) {
    syncServices.getStudents(function (err, students) {
        if (err) {
            response.statusCode = 500;

            response.json({
                students: []
            });
        }

        response.json({
            students: students
        });
    });
}
exports.getStudents = getStudents;
//# sourceMappingURL=sync.js.map
