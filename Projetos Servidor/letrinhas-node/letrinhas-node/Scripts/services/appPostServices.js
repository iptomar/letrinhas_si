var pool = require('../../configs/mysql');
var app = require('../../app');

var path = require('path');

var Q = require('q');

var mysql = require('mysql');
var mv = require('mv');
var uuid = require('node-uuid');

var poolQuery = Q.nbind(pool.query, pool);

// TODO: Implement this.
//export function sendBinaryDataToDb(binaryData: NodeBuffer, onDone: (err: Error) => void) {
//    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, (err, result) => {
//        console.log(result);
//        onDone(err);
//    });
//}
//export function saveTestCorrection(c: TestCorrection, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
//    if (c === null) {
//        return Q.reject(new Error('correction cannot be null.'));
//    }
//    switch (c.type) {
//        case TestType.read:
//        // Falls through
//        case TestType.list:
//        // Falls through
//        case TestType.poem:
//            var filePath = path.join('appContent/tests/test-' + c.testId),
//                fileName = path.join(filePath, c.studentId + '-' + c.executionDate + uploadedFileName.substring(uploadedFileName.lastIndexOf('.')));
//            // I don't like this.
//            var args = [
//                c.testId,
//                c.studentId,
//                c.executionDate,
//                pool.escape(fileName.replace(/\\/g, '/')),
//                pool.escape((<ReadingTestCorrection>c).professorObservations),
//                (<ReadingTestCorrection> c).wordsPerMinute,
//                (<ReadingTestCorrection> c).correctWordCount,
//                (<ReadingTestCorrection> c).readingPrecision,
//                (<ReadingTestCorrection> c).readingSpeed,
//                (<ReadingTestCorrection> c).expressiveness,
//                (<ReadingTestCorrection> c).rhythm,
//                pool.escape((<ReadingTestCorrection>c).details)
//            ];
//            var sql = "CALL insertReadingTestCorrection(" + args.toString() + ")";
//            return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
//                .then((_) => poolQuery(sql));
//        case TestType.multimedia:
//            var args = [
//                c.testId,
//                c.studentId,
//                c.executionDate,
//                (<MultimediaTestCorrection> c).optionChosen,
//                (<MultimediaTestCorrection> c).isCorrect
//            ];
//            return poolQuery("CALL insertReadingTestCorrection(" + args.toString() + ")");
//        default:
//            return Q.reject('Unknown value for correction.type.');
//    }
//}
function addTeacher(p, uploadedFilePath, uploadedFileName) {
    if (p === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/professors/' + uuid.v4()), fileName = path.join(filePath, 'professor' + uploadedFileName.substring(uploadedFileName.lastIndexOf('.', uploadedFileName.length)));
    var sql = mysql.format("Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(?,?,?,?,?,?,?,?)", [p.schoolId, p.name, p.username, p.password, p.emailAddress, p.telephoneNumber, p.isActive, fileName.replace(/\\/g, '/')]);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.addTeacher = addTeacher;

//export function addStudent(p: Aluno, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
//    if (p === null) {
//        return Q.reject(new Error('correction cannot be null.'));
//    }
//    var filePath = path.join('appContent/students/' + uuid.v4()),
//        fileName = path.join(filePath, 'student' + uploadedFileName.substring(uploadedFileName.lastIndexOf('.', uploadedFileName.length)));
//    var sql = mysql.format("Insert Into Students(`classId`,`name`,`photoUrl`,`isActive`) VALUES(?,?,?,?)", [p.classId, p.name, fileName.replace(/\\/g, '/'),p.isActive]);
//    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
//        .then((_) => poolQuery(sql));
//}
//export function addReadingTest(t: ReadingTest, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
//    if (t === null) {
//        return Q.reject(new Error('correction cannot be null.'));
//    }
//    var filePath = path.join('appContent/tests/' + uuid.v4()),
//        fileName = path.join(filePath, 'test' + uploadedFileName.substring(uploadedFileName.lastIndexOf('.', uploadedFileName.length)));
//    var sql = mysql.format("CALL insertReadingTest(?,?,?,?,?,?,?,?)", [t.areaId, t.professorId, t.title, t.mainText, t.grade, t.type, t.textContent, fileName.replace(/\\/g, '/')]);
//    console.log(sql);
//    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
//        .then((_) => poolQuery(sql));
//}
//export function addClass(c: SchoolClass): Q.Promise<any> {
//    if (c === null) {
//        return Q.reject(new Error('correction cannot be null.'));
//    }
//    var sql = mysql.format("Insert into Classes(`schoolId`,`classLevel`,`className`,`classYear`) VALUES(?,?,?,?)", [c.schoolId, c.classLevel, c.className, c.classYear]);
//    poolQuery(sql);
//}
function addSchool(s, uploadedFilePath, uploadedFileName) {
    if (s === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/schools/' + uuid.v4()), fileName = path.join(filePath, 'logo' + uploadedFileName.substring(uploadedFileName.lastIndexOf('.', uploadedFileName.length)));
    var sql = mysql.format("Insert Into Schools(`schoolAddress`,`schoolLogoUrl`,`schoolName`) VALUES(?,?,?)", [s.schoolAddress, fileName.replace(/\\/g, '/'), s.schoolName]);
    console.log(sql);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.addSchool = addSchool;
//# sourceMappingURL=appPostServices.js.map
