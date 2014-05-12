import pool = require('../../configs/mysql');
import app = require('../../app');


import path = require('path');
import fs = require('fs');
import Q = require('q');
import mkdirp = require('mkdirp');
import mysql = require('mysql');
import mv = require('mv');

import TestSummary = require('../structures/tests/TestSummary');
import TestType = require('../structures/tests/TestType');

import Professor = require('../structures/schools/Professor');
import Aluno = require('../structures/schools/Student');
import ReadingTest = require('../structures/tests/ReadingTest');


import TestCorrection = require('../structures/tests/TestCorrection');
import MultimediaTestCorrection = require('../structures/tests/MultimediaTestCorrection');
import ReadingTestCorrection = require('../structures/tests/ReadingTestCorrection');
import SchoolClass = require('../structures/schools/Class');


var poolQuery = Q.nbind(pool.query, pool);

// TODO: Implement this.
//export function sendBinaryDataToDb(binaryData: NodeBuffer, onDone: (err: Error) => void) {
//    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, (err, result) => {
//        console.log(result);
//        onDone(err);
//    });
//}

export function saveTestCorrection(c: TestCorrection, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
    if (c === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    switch (c.type) {
        case TestType.read:

            var filePath = path.join('appContent/tests/test-' + c.testId),
                fileName = path.join(filePath, c.studentId + '-' + c.executionDate + uploadedFileName.substring(uploadedFileName.lastIndexOf('.')));

            // I don't like this.
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                pool.escape(fileName.replace(/\\/g, '/')),
                pool.escape((<ReadingTestCorrection>c).professorObservations),
                (<ReadingTestCorrection>c).wordsPerMinute,
                (<ReadingTestCorrection>c).correctWordCount,
                (<ReadingTestCorrection>c).readingPrecision,
                (<ReadingTestCorrection>c).readingSpeed,
                (<ReadingTestCorrection>c).expressiveness,
                (<ReadingTestCorrection>c).rhythm,
                pool.escape((<ReadingTestCorrection>c).details)
            ];

            var sql = "CALL insertReadingTestCorrection(" + args.toString() + ")";

            return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
                .then((_) => poolQuery(sql));

        case TestType.multimedia:
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                (<MultimediaTestCorrection> c).optionChosen,
                (<MultimediaTestCorrection> c).isCorrect
            ];

            return poolQuery("CALL insertReadingTestCorrection(" + args.toString() + ")");

        default:
            return Q.reject('Unknown value for correction.type.');
    }
}

export function addTeacher(p: Professor, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any>{
    if (p === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }
    
    var filePath = path.join('appContent/professors/professor-' + p.name),
        fileName = path.join(filePath, uploadedFileName);
       
    var sql = "Insert Into Professors(`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES(" + p.schoolId + ",'" + p.name + "','" + p.username + "','" + p.password + "','" + p.emailAddress + "','" + p.telephoneNumber + "'," + p.isActive + ",'" + fileName.replace(/\\/g, '/')+"')";

   

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
        .then((_) => poolQuery(sql));

}

export function addStudent(p: Aluno, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
    if (p === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/students/student-' + p.name),
        fileName = path.join(filePath, uploadedFileName);
     
    var sql = "Insert Into Students(`classId`,`name`,`photoUrl`,`isActive`) VALUES(" + p.classId + ",'" + p.name + "','" + fileName.replace(/\\/g, '/') +  "','"  + p.isActive + "')";

    console.log(sql);


    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
        .then((_) => poolQuery(sql));

}

export function addReadingTest(t: ReadingTest, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
    if (t === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var filePath = path.join('appContent/tests/test-' + t.title + '-' +  Math.floor(Math.random() * 100)),
        fileName = path.join(filePath, uploadedFileName);
   
    var sql = "CALL insertReadingTest(" + t.areaId + ", " + t.professorId + ", '" + t.title + "', '" + t.mainText + "', " + Date.now ()+ ", " + t.grade + ", " + t.type + ", '" + t.textContent + "', '" + fileName.replace(/\\/g, '/')+"')";
    console.log(sql);
    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
        .then((_) => poolQuery(sql));    
    }


export function addClass(c: SchoolClass): Q.Promise<any> {
    if (c === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    var sql = "Insert Into Classes(`schoolId`,`classLevel`,`className`,`classYear`) VALUES(" + c.schoolId + ",'" + c.classLevel + "','" + c.className + "','" + c.classYear + "')";

    poolQuery(sql);

}