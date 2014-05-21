var Q = require('q');
var pool = require('../../configs/mysql');
var mysql = require('mysql');

var poolQuery = Q.nbind(pool.query, pool);

function all() {
    // TODO: Restrict to current year.
    return poolQuery('SELECT * FROM Classes').then(function (classes) {
        return classes[0];
    });
}
exports.all = all;

function details(id) {
    return poolQuery(mysql.format('SELECT * FROM Classes WHERE id = ?', [id])).then(function (results) {
        return Q.resolve(results[0].length === 0 ? null : results[0][0]);
    });
}
exports.details = details;

function professors(classId) {
    var sql = 'SELECT * FROM ProfessorClass' + (!isNaN(classId) ? ' WHERE classId = ' + classId : '');
    return poolQuery(sql).then(function (results) {
        return results[0];
    });
}
exports.professors = professors;

function createClass(c) {
    var sql = mysql.format("Insert into Classes(`schoolId`,`classLevel`,`className`,`classYear`) VALUES(?,?,?,?)", [c.schoolId, c.classLevel, c.className, c.classYear]);
    return poolQuery(sql);
}
exports.createClass = createClass;

function getAllClasses(onResult) {
    //realiza a query
    pool.query("select b.schoolName, a.classLevel, a.className, a.classYear, a.id from Classes as a, Schools as b where a.schoolId = b.id;", function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push({
                    id: rows[i].id,
                    schoolName: rows[i].schoolName,
                    classLevel: rows[i].classLevel,
                    className: rows[i].className,
                    classYear: rows[i].classYear
                });
            }
        }
        return onResult(null, result);
    });
}
exports.getAllClasses = getAllClasses;
exports.getAllClasses = exports.getAllClasses;

function getClassBySchoolId(id, onResult) {
    //realiza a query
    pool.query(mysql.format("select b.schoolName, a.classLevel, a.className, a.classYear, a.id from Classes as a, Schools as b where a.schoolId = b.id and b.id = ? ;", [id]), function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];
            for (var i = 0; i < rows.length; i++) {
                result.push({
                    id: rows[i].id,
                    schoolName: rows[i].schoolName,
                    classLevel: rows[i].classLevel,
                    className: rows[i].className,
                    classYear: rows[i].classYear
                });
            }
        }
        return onResult(null, result);
    });
}
exports.getClassBySchoolId = getClassBySchoolId;
exports.getClassBySchoolId = exports.getClassBySchoolId;
//# sourceMappingURL=classService.js.map
