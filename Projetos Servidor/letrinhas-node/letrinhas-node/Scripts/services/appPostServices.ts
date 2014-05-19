import pool = require('../../configs/mysql');
import app = require('../../app');


import path = require('path');
import fs = require('fs');
import Q = require('q');
import mkdirp = require('mkdirp');
import mysql = require('mysql');
import mv = require('mv');
import uuid = require('node-uuid');


import TestSummary = require('../structures/tests/TestSummary');
import TestType = require('../structures/tests/TestType');

import Professor = require('../structures/schools/Professor');
import Aluno = require('../structures/schools/Student');
import ReadingTest = require('../structures/tests/ReadingTest');


import TestCorrection = require('../structures/tests/TestCorrection');
import MultimediaTestCorrection = require('../structures/tests/MultimediaTestCorrection');
import ReadingTestCorrection = require('../structures/tests/ReadingTestCorrection');
import SchoolClass = require('../structures/schools/Class');
import School = require('../structures/schools/School');


var poolQuery = Q.nbind<any>(pool.query, pool);

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

export function addTeacher(p: Professor, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
    if (p === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/professors/' + uuid.v4()),
        fileName = path.join(filePath, 'professor' + uploadedFileName.substring(uploadedFileName.lastIndexOf('.', uploadedFileName.length)));
    var sql = mysql.format("Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(?,?,?,?,?,?,?,?)", [p.schoolId, p.name, p.username, p.password, p.emailAddress, p.telephoneNumber, p.isActive, fileName.replace(/\\/g, '/')]);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
        .then((_) => poolQuery(sql));

}

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

//export function addSchool(s: School, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
//    if (s === null) {
//        return Q.reject(new Error('correction cannot be null.'));
//    }


//    var filePath = path.join('appContent/schools/' + uuid.v4()),
//        fileName = path.join(filePath, 'logo' + uploadedFileName.substring(uploadedFileName.lastIndexOf('.', uploadedFileName.length)));
//    var sql = mysql.format("Insert Into Schools(`schoolAddress`,`schoolLogoUrl`,`schoolName`) VALUES(?,?,?)", [s.schoolAddress, fileName.replace(/\\/g, '/'), s.schoolName]);
//    console.log(sql);
//    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
//        .then((_) => poolQuery(sql));

//}