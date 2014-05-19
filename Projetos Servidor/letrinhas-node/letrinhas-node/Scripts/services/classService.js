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
//# sourceMappingURL=classService.js.map
