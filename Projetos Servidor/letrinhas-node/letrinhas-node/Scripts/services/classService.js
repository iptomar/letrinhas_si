var Q = require('q');
var pool = require('../../configs/mysql');
var mysql = require('mysql');

var poolQuery = Q.nbind(pool.query, pool);

/**
* @author redroserade (André Carvalho)
*/
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

/**
* Devolve uma lista de turmas, juntamente com o nome da escola respectiva.
* @author luisfmoliveira (Luís Oliveira)
*/
function classDetails(schoolId) {
    var sql = "select b.schoolName, a.classLevel, a.className, a.classYear, a.id from Classes as a, Schools as b where a.schoolId = b.id";

    if (!isNaN(schoolId)) {
        sql = mysql.format(sql + ' AND b.id = ?', [schoolId]);
    }

    return poolQuery(sql).then(function (results) {
        return results[0];
    });
}
exports.classDetails = classDetails;
//# sourceMappingURL=classService.js.map
