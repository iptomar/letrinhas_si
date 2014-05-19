var pool = require('../../configs/mysql');
var Q = require('q');
var mysql = require('mysql');
var uuid = require('node-uuid');
var path = require('path');
var mv = require('mv');
var app = require('../../app');

var poolQuery = Q.nbind(pool.query, pool);

function all(isActive) {
    if (typeof isActive === "undefined") { isActive = true; }
    return poolQuery('SELECT * FROM Professors WHERE isActive = ' + isActive).then(function (results) {
        return results[0];
    });
}
exports.all = all;

function details(id) {
    return poolQuery(mysql.format('SELECT * FROM Professors WHERE id = ?', [id])).then(function (results) {
        if (results[0].length === 0) {
            return Q.resolve(null);
        }

        return Q.resolve(results[0][0]);
    });
}
exports.details = details;

function createProfessor(p, uploadedFilePath) {
    // eg: appContent/Professors/uuid/picture.jpg
    var filePath = path.join('appContent/Professors', uuid.v4(), 'picture' + path.extname(uploadedFilePath)).replace(/\\/g, '/');

    var sql = mysql.format("Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(?,?,?,?,?,?,?,?)", [p.schoolId, p.name, p.username, p.password, p.emailAddress, p.telephoneNumber, p.isActive, filePath]);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.createProfessor = createProfessor;
//# sourceMappingURL=professorService.js.map
