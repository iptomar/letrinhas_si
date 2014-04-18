﻿/// <reference path="../typings/mysql/mysql.d.ts" />
'use strict';
var mysqlConfig = require('../../configs/mysql');

var pool = mysqlConfig.pool;

/**
* Defines a professor in this app.
*/
var Professor = (function () {
    function Professor() {
    }
    return Professor;
})();
exports.Professor = Professor;

var SchoolClass = (function () {
    function SchoolClass() {
    }
    return SchoolClass;
})();
exports.SchoolClass = SchoolClass;

var ProfessorClassLecture = (function () {
    function ProfessorClassLecture() {
    }
    return ProfessorClassLecture;
})();
exports.ProfessorClassLecture = ProfessorClassLecture;

var School = (function () {
    function School() {
    }
    return School;
})();
exports.School = School;

var Student = (function () {
    function Student() {
    }
    return Student;
})();
exports.Student = Student;

// Select statements.
/**
* SELECT statmeent to obtain all schools.
*/
var SELECT_SCHOOLS = 'SELECT * FROM Schools';

/**
* SELECT statmeent to obtain all schools.
*/
var SELECT_PROFESSORS = 'SELECT * FROM Professors';

function getSchools(onDone) {
    // Get the schools.
    pool.query(SELECT_SCHOOLS, function (err, rows, fields) {
        if (err) {
            return onDone(err, []);
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

function getProfessors(onDone) {
    pool.query(SELECT_PROFESSORS, function (err, rows, fields) {
        if (err) {
            return onDone(err, []);
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

        onDone(err, professors);
    });
}
exports.getProfessors = getProfessors;
//# sourceMappingURL=syncServices.js.map
