/*
* Routes related to tests.
*/
var pool = require('../../configs/mysql');
var Q = require('q');
var mysql = require('mysql');
var path = require('path');
var uuid = require('node-uuid');
var app = require('../../app');
var mv = require('mv');

var poolQuery = Q.nbind(pool.query, pool);

var TestType = require('../structures/tests/TestType');

// GET: /Tests/All/
// Params:
// -ofType=[0, 1, 2, 3]
// -areaId
// -grade
// -professorId
// -creationDate
function all(ofType, options) {
    var parameters = [];

    // Build the sql query.
    var where = 'WHERE t.type = ' + ofType;

    if (typeof options !== 'undefined') {
        if (typeof options.areaId !== 'undefined') {
            parameters.push({ name: 'areaId', value: options.areaId });
        }
        if (typeof options.grade !== 'undefined') {
            parameters.push({ name: 'grade', value: options.grade });
        }
        if (typeof options.professorId !== 'undefined') {
            parameters.push({ name: 'professorId', value: options.professorId });
        }
        if (typeof options.creationDate !== 'undefined') {
            where += ' AND t.creationDate > ' + options.creationDate;
        }
    }

    for (var i = 0; i < parameters.length; i += 1) {
        where += ' AND t.' + parameters[i].name + ' = ' + parameters[i].value;
    }

    switch (ofType) {
        case 0 /* read */:

        case 2 /* list */:

        case 3 /* poem */:
            return poolQuery('select t.id, t.type, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.areaId, rt.professorAudioUrl, rt.textContent from Tests as t join ReadingTests as rt on rt.id = t.id ' + where).then(function (result) {
                return result[0];
            });
        case 1 /* multimedia */:
            return poolQuery('SELECT t.id, t.type, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.areaId, mt.questionContent, mt.contentIsUrl, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id ' + where).then(function (result) {
                return result[0];
            });
            break;
        default:
            return Q.reject('Unknown test type.');
    }
}
exports.all = all;

/**
* Devolve uma lista de testes multimédia, escolhidos aleatóriamente a partir da db.
* Portado por @redroserade para usar promises.
*
* @author luisfmoliveira
*/
function random(options) {
    if (isNaN(options.area) || isNaN(options.year)) {
        return Q.reject('Invalid area or grade. They must be numbers.');
    }

    var sql = 'SELECT t.id, t.type, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.areaId, mt.questionContent, mt.contentIsUrl, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id WHERE t.areaId = ' + options.area + ' AND t.grade = ' + options.year;

    console.log(sql);

    return poolQuery(sql).then(function (results) {
        var tests = results[0], aux, i, rnd, result = new Array();

        //Caso o numero de perguntas que o professor quer, sobre um tema, seja igual ou superior as que existem na BD, devolve todas. Pode-se alterar por uma
        //mensagem de erro. Fica para se decidir
        if (options.num >= tests.length) {
            return tests;
        }

        aux = 0;

        for (i = 1; i <= options.num; i += 1) {
            rnd = Math.floor((Math.random() * tests.length) + 1);

            if (rnd !== aux) {
                result.push(tests[rnd - 1]);
                aux = rnd;
            } else {
                i = i - 1;
            }
        }

        return result;
    });
}
exports.random = random;

// GET: /Tests/Details/:id
function details(id) {
    return poolQuery({ sql: 'CALL getTestById(?)', nestTables: false }, id).then(function (result) {
        // Return a 404 if no tests were found.
        if (result[0][0].length === 0) {
            return Q.resolve(null);
        }

        // Return a single test.
        return Q.resolve(result[0][0][0]);
    });
}
exports.details = details;

// POST: /Tests/Create/Read
function createReadTest(t, uploadedFilePath) {
    // eg: appContent/Tests/uuid/demo.mp3
    var filePath = path.join('appContent/Tests', uuid.v4(), 'demo' + path.extname(uploadedFilePath)).replace(/\\/g, '/');

    var sql = mysql.format("CALL insertReadingTest(?,?,?,?,?,?,?,?,?)", [t.areaId, t.professorId, t.title, t.mainText, Date.now(), t.grade, t.type, t.textContent, filePath]);

    console.log(sql);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.createReadTest = createReadTest;

/**
* Só para texto.
*/
function createMultimediaTest(t) {
    // Construir o caminho-base para guardar o teste.
    var basePath = 'appContent/Tests/' + uuid.v4(), oldOption1Path, oldOption2Path, oldOption3Path, oldQuestionContentPath;

    var mvOperations = [];

    // if's para cada um dos campos isUrl
    if (t.contentIsUrl) {
        oldQuestionContentPath = t.questionContent;

        t.questionContent = basePath + '/questionContent' + path.extname(t.questionContent);
        mvOperations.push(Q.nfcall(mv, oldQuestionContentPath, path.join(app.rootDir, t.questionContent), { mkdirp: true }));
    }

    if (t.option1IsUrl) {
        oldOption1Path = t.option1;

        t.option1 = basePath + '/option1' + path.extname(t.option1);

        mvOperations.push(Q.nfcall(mv, oldOption1Path, path.join(app.rootDir, t.option1), { mkdirp: true }));
    }

    if (t.option2IsUrl) {
        oldOption2Path = t.option2;

        t.option2 = basePath + '/option2' + path.extname(t.option2);

        mvOperations.push(Q.nfcall(mv, oldOption2Path, path.join(app.rootDir, t.option2), { mkdirp: true }));
    }

    if (t.option3IsUrl) {
        oldOption3Path = t.option3;

        t.option3 = basePath + '/option3' + path.extname(t.option3);

        mvOperations.push(Q.nfcall(mv, oldOption3Path, path.join(app.rootDir, t.option3), { mkdirp: true }));
    }

    return Q.all(mvOperations).then(function (_) {
        var sql = 'CALL insertMultimediaTest(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

        sql = mysql.format(sql, [
            t.areaId,
            t.professorId,
            t.title,
            t.mainText,
            Date.now(),
            t.grade,
            1,
            t.questionContent,
            t.contentIsUrl,
            t.option1,
            t.option1IsUrl,
            t.option2,
            t.option2IsUrl,
            t.option3,
            t.option3IsUrl,
            t.correctOption
        ]);

        return poolQuery(sql);
    });
}
exports.createMultimediaTest = createMultimediaTest;

// GET + POST: /Tests/Edit/:id
function edit(id) {
    throw 'NYI';
}
exports.edit = edit;

// POST: /Tests/Submit/:id
function submitResult(tc, filePath) {
    var args = [
        tc.testId,
        tc.studentId,
        tc.executionDate
    ];

    switch (tc.type) {
        case 0 /* read */:

        case 2 /* list */:

        case 3 /* poem */:
            var rtc = tc, newPath = null;

            if (typeof filePath !== 'undefined') {
                newPath = path.join('appContent', 'Tests', tc.testId + '', 'Submissions', tc.studentId + '', tc.executionDate + path.extname(filePath)).replace(/\\/g, '/');
            }

            args = args.concat([
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

            //Only save the file if it exists.
            //TODO: Check if we have SOMETHING in the DB, in case the file is sent twice.
            if (newPath !== null) {
                return Q.nfcall(mv, filePath, path.join(app.rootDir, newPath), { mkdirp: true }).then(function (_) {
                    return poolQuery(sql);
                });
            } else {
                return poolQuery(sql);
            }
            break;
        case 1 /* multimedia */:
            var mtc = tc;

            args = args.concat([
                mtc.optionChosen,
                mtc.isCorrect
            ]);

            var sql = mysql.format('CALL insertMultimediaTestCorrection(?,?,?,?,?)', args);

            return poolQuery(sql);
            break;
        default:
            return Q.reject('Unknown type.');
    }
}
exports.submitResult = submitResult;

/**
* Returns a list of submissions for (optionally) a test, student and test.
*/
function readingSubmissions(isCorrected, studentId, testId) {
    if (typeof isCorrected === "undefined") { isCorrected = null; }
    if (typeof studentId === "undefined") { studentId = null; }
    if (typeof testId === "undefined") { testId = null; }
    var sql = "select tc.testId,tc.studentId,tc.executionDate,tc.type,rtc.soundFileUrl,rtc.professorObservations,rtc.wordsPerMinute,rtc.correctWordCount,rtc.readingPrecision,rtc.readingSpeed,rtc.expressiveness,rtc.rhythm,rtc.details,rtc.wasCorrected from TestCorrections as tc join ReadingTestCorrections as rtc on tc.testId = rtc.testId and tc.studentId = rtc.studentId and tc.executionDate = rtc.executionDate where true ";

    if (isCorrected !== null) {
        sql += mysql.format(' and rtc.wasCorrected = ?', [isCorrected]);
    }
    if (studentId !== null) {
        sql += mysql.format(" and tc.studentId = ?", [studentId]);
    }
    if (testId !== null) {
        sql += mysql.format(" and tc.testId = ?", [testId]);
    }

    return poolQuery(sql).then(function (results) {
        return results[0];
    });
}
exports.readingSubmissions = readingSubmissions;

function multimediaSubmisssions(studentId, testId) {
    if (typeof studentId === "undefined") { studentId = null; }
    if (typeof testId === "undefined") { testId = null; }
    var sql = 'select * from MultimediaTestCorrections where true ';

    if (studentId !== null) {
        sql += mysql.format(" and studentId = ?", [studentId]);
    }
    if (testId !== null) {
        sql += mysql.format(" and testId = ?", [testId]);
    }

    return poolQuery(sql).then(function (results) {
        return results[0];
    });
}
exports.multimediaSubmisssions = multimediaSubmisssions;

/**
* Devolve uma lista de titulos de testes.
* @author luisfmoliveira (Luís Oliveira)
*/
function testTitles(professorId) {
    var sql = "select t.id, t.areaId, t.title, t.mainText, t.grade, p.name, t.professorId, t.type, t.creationDate from Tests as t, Professors as p where t.professorId = p.id";

    if (!isNaN(professorId)) {
        sql = mysql.format(sql + ' AND t.professorId = ?', [professorId]);
    }
    return poolQuery(sql).then(function (results) {
        var titles = results[0];

        for (var i = 0; i < titles.length; i++) {
            var d = new Date(titles[i].creationDate);

            titles[i].creationDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + (d.getDate() + 1);
        }

        return titles;
    });
}
exports.testTitles = testTitles;

function testDetails(testId) {
    var sql = "select r.id, r.textContent, r.professorAudioUrl, t.title from ReadingTests as r, Tests as t where r.id = t.id";

    if (!isNaN(testId)) {
        sql = mysql.format(sql + ' AND r.id = ?', [testId]);
    }

    return poolQuery(sql).then(function (results) {
        return results[0][0];
    });
}
exports.testDetails = testDetails;

function testDetailsMultimedia(testId) {
    var sql = "select m.id, m.questionContent, m.contentIsUrl, m.option1, m.option1IsUrl, m.option2, m.option2IsUrl, m.option3, m.option3IsUrl, m.correctOption from MultimediaTests as m, Tests as t where m.id = t.id";

    if (!isNaN(testId)) {
        sql = mysql.format(sql + ' AND m.id = ?', [testId]);
    }
    return poolQuery(sql).then(function (results) {
        return results[0][0];
    });
}
exports.testDetailsMultimedia = testDetailsMultimedia;
//# sourceMappingURL=testService.js.map
