/*
 * Routes related to tests.
 */
import pool = require('../configs/mysql');
import Q = require('q');
import mysql = require('mysql');
import path = require('path');
import uuid = require('node-uuid');
import app = require('../app');
import mv = require('mv');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Test = require('../Scripts/structures/tests/Test');
import ReadingTest = require('../Scripts/structures/tests/ReadingTest');

import TestType = require('../Scripts/structures/tests/TestType');
import TestCorrection = require('../Scripts/structures/tests/TestCorrection');
import ReadingTestCorrection = require('../Scripts/structures/tests/ReadingTestCorrection');
import MultimediaTestCorrection = require('../Scripts/structures/tests/MultimediaTestCorrection');

import Student = require('../Scripts/structures/schools/Student');

// GET: /Tests/All/
// Params: 
// -ofType=[0, 1, 2, 3]
// -areaId
// -grade
// -professorId
// -creationDate
export function all(ofType: number, options?: { areaId?: number; grade?: number; professorId?: number; creationDate?: number }): Q.Promise<Array<Test>> {
    var parameters = [];

    if (typeof options.areaId !== 'undefined') { parameters.push({ name: 'areaId', value: options.areaId }); }
    if (typeof options.grade !== 'undefined') { parameters.push({ name: 'grade', value: options.grade }); }
    if (typeof options.professorId !== 'undefined') { parameters.push({ name: 'professorId', value: options.professorId }); }

    // Build the sql query.
    var where = 'WHERE t.type = ' + ofType;

    for (var i = 0; i < parameters.length; i += 1) {
        where += ' AND t.' + parameters[i].name + ' = ' + parameters[i].value;
    }

    if (options.creationDate) {
        where += ' AND t.creationDate > ' + options.creationDate;
    }

    switch (ofType) {
        case TestType.read:
        /* falls through */
        case TestType.list:
        /* falls through */
        case TestType.poem:
            return poolQuery('select t.id, t.type, t.professorId, t.title, t.mainText, unix_timestamp(t.creationDate) as creationDate, t.grade, t.areaId, rt.professorAudioUrl, rt.textContent from Tests as t join ReadingTests as rt on rt.id = t.id ' + where)
                .then<Array<Test>>((result) => result[0]);
        case TestType.multimedia:
            return poolQuery('SELECT t.id, t.type, t.professorId, t.title, t.mainText, UNIX_TIMESTAMP(t.creationDate) AS creationDate, t.grade, t.areaId, mt.questionContent, mt.contentIsUrl, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id ' + where)
                .then<Array<Test>>((result) => result[0]);
            break;
        default:
            return Q.reject('Unknown test type.');
    }
}

// GET: /Tests/Details/:id
export function details(id: number): Q.Promise<Test> {

    return poolQuery({ sql: 'CALL getTestById(?)', nestTables: false }, id)
        .then((result) => {
            // Return a 404 if no tests were found.
            if (result[0][0].length === 0) {
                return Q.resolve(null);
            }

            // Return a single test.
            return Q.resolve(result[0][0][0]);
        });
}

// POST: /Tests/Create/Read
export function createReadTest(t: ReadingTest, uploadedFilePath: string): Q.Promise<void> {
    var filePath = path.join('appContent/tests', uuid.v4(), 'professor' + path.extname(uploadedFilePath)).replace(/\\/g, '/');

    var sql = mysql.format("CALL insertReadingTest(?,?,?,?,?,?,?,?,?)", [t.areaId, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.type, t.textContent, filePath]);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true })
        .then((_) => poolQuery(sql));
}

// GET + POST: /Tests/Edit/:id
export function edit() {
    throw 'NYI';
}

// POST: /Tests/Submit/:id
export function submitResult(tc: TestCorrection, filePath?: string): Q.Promise<void> {

    var args: Array<any> = [
        tc.testId,
        tc.studentId,
        tc.executionDate
    ];

    switch (tc.type) {
        case TestType.read:
        /* falls through */
        case TestType.list:
        /* falls through */
        case TestType.poem:
            var rtc = <ReadingTestCorrection> tc,
                // eg: appContent/Tests/1/Submissions/2/timestamp.mp3
                newPath = path.join('appContent', 'Tests',
                    tc.testId, 'Submissions',
                    tc.studentId,
                    tc.executionDate + path.extname(filePath)).replace(/\\/g, '/');

            args.concat([
                newPath,
                rtc.professorObservations,
                rtc.wordsPerMinute,
                rtc.correctWordCount,
                rtc.readingPrecision,
                rtc.readingSpeed,
                rtc.expressiveness,
                rtc.rhythm,
                rtc.details,
                rtc.wasCorrected,
                rtc.type
            ]);

            var sql = mysql.format('CALL insertReadingTestCorrection(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', args);

            return Q.nfcall(mv, path.join(app.rootDir, newPath), { mkdirp: true })
                .then((_) => poolQuery(sql));
        case TestType.multimedia:
            var mtc = <MultimediaTestCorrection> tc;

            args.concat([
                mtc.optionChosen,
                mtc.isCorrect
            ]);

            var sql = mysql.format('CALL insertMultimediaTestCorrection(?,?,?,?,?)', args);

            return poolQuery(sql);
        default:
            return Q.reject('Unknown type.');
    }
}