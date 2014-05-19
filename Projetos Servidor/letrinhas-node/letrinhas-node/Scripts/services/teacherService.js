var pool = require('../../configs/mysql');
var Q = require('q');
var mysql = require('mysql');
var uuid = require('node-uuid');
var path = require('path');
var mv = require('mv');
var app = require('../../app');

var poolQuery = Q.nbind(pool.query, pool);

function createTeacher(p, uploadedFilePath) {
    if (p === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/professors/' + uuid.v4()), fileName = path.join(filePath, 'professor' + uploadedFileName.substring(uploadedFileName.lastIndexOf('.', uploadedFileName.length)));
    var sql = mysql.format("Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(?,?,?,?,?,?,?,?)", [p.schoolId, p.name, p.username, p.password, p.emailAddress, p.telephoneNumber, p.isActive, fileName.replace(/\\/g, '/')]);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.createTeacher = createTeacher;
//# sourceMappingURL=teacherService.js.map
