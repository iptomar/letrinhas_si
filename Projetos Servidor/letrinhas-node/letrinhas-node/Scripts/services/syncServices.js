var pool = require('../../configs/mysql');

/**
* Gets the list of schools from the db.
*/
function getSchools(onDone) {
    // Get the schools.
    pool.query('SELECT * FROM Schools', function (err, rows, fields) {
        if (err) {
            return onDone(err, null);
        }

        var schools = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            schools[i] = {
                id: rows[i].id,
                schoolAddress: rows[i].schoolAddress,
                schoolLogoUrl: rows[i].schoolLogoUrl,
                schoolName: rows[i].schoolName
            };
        }

        onDone(null, schools);
    });
}
exports.getSchools = getSchools;

/**
* Gets a list of professors which are currently active.
*/
function getProfessors(onDone) {
    pool.query('SELECT * FROM Professors WHERE isActive = 1', function (err, rows, fields) {
        if (err) {
            return onDone(err, null);
        }

        var professors = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            professors[i] = {
                id: rows[i].id,
                schoolId: rows[i].schoolId,
                name: rows[i].name,
                username: rows[i].username,
                password: rows[i].password,
                emailAddress: rows[i].emailAddress,
                telephoneNumber: rows[i].telephoneNumber,
                isActive: rows[i].isActive,
                photoUrl: rows[i].photoUrl
            };
        }

        onDone(null, professors);
    });
}
exports.getProfessors = getProfessors;

/**
* Gets a list of classes for the current year.
*/
function getClasses(onDone) {
    pool.query('SELECT * FROM Classes', function (err, rows, fields) {
        if (err) {
            return onDone(err, null);
        }

        var classes = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            classes[i] = {
                id: rows[i].id,
                schoolId: rows[i].schoolId,
                classLevel: rows[i].classLevel,
                className: rows[i].className,
                classYear: rows[i].classYear
            };
        }

        onDone(null, classes);
    });
}
exports.getClasses = getClasses;

/**
* Gets a list of students which are currently active.
*/
function getStudents(onDone) {
    pool.query('SELECT * FROM Students WHERE isActive = true', function (err, rows, fields) {
        if (err) {
            return onDone(err, null);
        }

        var students = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            students[i] = {
                id: rows[i].id,
                classId: rows[i].classId,
                isActive: rows[i].isActive,
                name: rows[i].name,
                photoUrl: rows[i].photoUrl
            };
        }

        onDone(null, students);
    });
}
exports.getStudents = getStudents;
//# sourceMappingURL=syncServices.js.map
