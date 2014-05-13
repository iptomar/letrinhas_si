var pool = require('../../configs/mysql');
var app = require('../../app');

var path = require('path');

var Q = require('q');

var mv = require('mv');

var TestType = require('../structures/tests/TestType');

var poolQuery = Q.nbind(pool.query, pool);

// TODO: Implement this.
//export function sendBinaryDataToDb(binaryData: NodeBuffer, onDone: (err: Error) => void) {
//    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, (err, result) => {
//        console.log(result);
//        onDone(err);
//    });
//}
function saveTestCorrection(c, uploadedFilePath, uploadedFileName) {
    if (c === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    switch (c.type) {
        case 0 /* read */:

        case 2 /* list */:

        case 3 /* poem */:
            var filePath = path.join('appContent/tests/test-' + c.testId), fileName = path.join(filePath, c.studentId + '-' + c.executionDate + uploadedFileName.substring(uploadedFileName.lastIndexOf('.')));

            // I don't like this.
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                pool.escape(fileName.replace(/\\/g, '/')),
                pool.escape(c.professorObservations),
                c.wordsPerMinute,
                c.correctWordCount,
                c.readingPrecision,
                c.readingSpeed,
                c.expressiveness,
                c.rhythm,
                pool.escape(c.details)
            ];

            var sql = "CALL insertReadingTestCorrection(" + args.toString() + ")";

            return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true }).then(function (_) {
                return poolQuery(sql);
            });

        case 1 /* multimedia */:
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                c.optionChosen,
                c.isCorrect
            ];

            return poolQuery("CALL insertReadingTestCorrection(" + args.toString() + ")");

        default:
            return Q.reject('Unknown value for correction.type.');
    }
}
exports.saveTestCorrection = saveTestCorrection;

function addTeacher(p, uploadedFilePath, uploadedFileName) {
    if (p === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/professors/professor-' + p.name), fileName = path.join(filePath, uploadedFileName);

    var sql = "Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(" + p.schoolId + ",'" + p.name + "','" + p.username + "','" + p.password + "','" + p.emailAddress + "','" + p.telephoneNumber + "'," + p.isActive + ",'" + fileName.replace(/\\/g, '/') + "')";

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.addTeacher = addTeacher;

function addStudent(p, uploadedFilePath, uploadedFileName) {
    if (p === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/students/student-' + p.name), fileName = path.join(filePath, uploadedFileName);

    var sql = "Insert Into Students(`classId`,`name`,`photoUrl`,`isActive`) VALUES(" + p.classId + ",'" + p.name + "','" + fileName.replace(/\\/g, '/') + "','" + p.isActive + "')";

    console.log(sql);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.addStudent = addStudent;

function addReadingTest(t, uploadedFilePath, uploadedFileName) {
    if (t === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/tests/test-' + t.title + '-' + Math.floor(Math.random() * 100)), fileName = path.join(filePath, uploadedFileName);

    var sql = "CALL insertReadingTest(" + t.areaId + ", " + t.professorId + ", '" + t.title + "', '" + t.mainText + "', " + Date.now() + ", " + t.grade + ", " + t.type + ", '" + t.textContent + "', '" + fileName.replace(/\\/g, '/') + "')";
    console.log(sql);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.addReadingTest = addReadingTest;

function addClass(c) {
    if (c === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var sql = "Insert Into Classes(`schoolId`,`classLevel`,`className`,`classYear`) VALUES(" + c.schoolId + ",'" + c.classLevel + "','" + c.className + "','" + c.classYear + "')";

    poolQuery(sql);
}
exports.addClass = addClass;
//# sourceMappingURL=appPostServices.js.map
