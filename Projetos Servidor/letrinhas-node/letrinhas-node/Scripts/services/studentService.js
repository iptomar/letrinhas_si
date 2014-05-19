/*
* Routes related to students.
*/
var pool = require('../../configs/mysql');
var Q = require('q');
var mysql = require('mysql');
var uuid = require('node-uuid');
var path = require('path');
var mv = require('mv');
var app = require('../../app');

var poolQuery = Q.nbind(pool.query, pool);

// GET: /Students/All/
function all() {
    return poolQuery('SELECT * FROM Students WHERE isActive = true').then(function (students) {
        return students[0];
    });
}
exports.all = all;

// GET: /Students/Details/:id
function details(id) {
    return poolQuery(mysql.format('SELECT * FROM Students WHERE id = ? AND isActive = 1', [id])).then(function (students) {
        if (students[0].length === 0) {
            return Q.resolve(null);
        }

        return students[0][0];
    });
}
exports.details = details;

// POST: /Students/Create/
function create(s, uploadedFilePath) {
    // eg: appContent/Students/uuid/picture.jpg
    var filePath = path.join('appContent/Students', uuid.v4(), 'picture' + path.extname(uploadedFilePath)).replace(/\\/g, '/');

    // A student is active by default.
    var sql = mysql.format("Insert Into Students(`classId`,`name`,`photoUrl`,`isActive`) VALUES(?,?,?,?)", [s.classId, s.name, filePath]);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.create = create;
//# sourceMappingURL=studentService.js.map
