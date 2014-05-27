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

    var sql = mysql.format("CALL insertReadingTest(?,?,?,?,?,?,?,?,?)", [t.areaId, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.type, t.textContent, filePath]);

    console.log(sql);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true }).then(function (_) {
        return poolQuery(sql);
    });
}
exports.createReadTest = createReadTest;

/**
* Só para texto.
*/
function saveMultimediaTest(teste) {
    // Construir o caminho-base para guardar o teste.
    var caminhoBase = 'appContent/Tests/' + uuid.v4(), camOp1, camOp2, camOp3, camConteudo;

    // if's para cada um dos campos isUrl
    if (teste.contentIsUrl === true) {
        // Guardar o ficheiro relativo ao conteúdo.
        camConteudo = caminhoBase + '/pergunta' + path.extname(teste.questionContent);
    } else {
    }

    return Q.reject('Ainda nao está implementado!');
}
exports.saveMultimediaTest = saveMultimediaTest;

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
                newPath = path.join('appContent', 'Tests', tc.testId, 'Submissions', tc.studentId, tc.executionDate + path.extname(filePath)).replace(/\\/g, '/');
            }

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

            // Only save the file if it exists.
            // TODO: Check if we have SOMETHING in the DB, in case the file is sent twice.
            if (newPath !== null) {
                return Q.nfcall(mv, path.join(app.rootDir, newPath), { mkdirp: true }).then(function (_) {
                    return poolQuery(sql);
                });
            } else {
                return poolQuery(sql);
            }
        case 1 /* multimedia */:
            var mtc = tc;

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
exports.submitResult = submitResult;

function submissions(isCorrected, studentId, testId) {
    var sql = "select tc.testId,tc.studentId,tc.executionDate,tc.type,rtc.testId,rtc.studentId,rtc.executionDate,rtc.soundFileUrl,rtc.professorObservations,rtc.wordsPerMinute,rtc.correctWordCount,rtc.readingPrecision,rtc.readingSpeed,rtc.expressiveness,rtc.rhythm,rtc.details,rtc.wasCorrected from TestCorrections as tc join ReadingTestCorrections as rtc on tc.testId = rtc.testId and tc.studentId = rtc.studentId and tc.executionDate = rtc.executionDate WHERE rtc.wasCorrected = " + isCorrected;

    if (typeof studentId !== 'undefined') {
        sql += " and tc.studentId = " + studentId;
    }
    if (typeof testId !== 'undefined') {
        sql += " and tc.testId = " + testId;
    }

    return poolQuery(sql).then(function (results) {
        return results[0];
    });
}
exports.submissions = submissions;
//# sourceMappingURL=testService.js.map
