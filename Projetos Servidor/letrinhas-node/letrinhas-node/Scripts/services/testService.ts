/*
 * Routes related to tests.
 */
import pool = require('../../configs/mysql');
import Q = require('q');
import mysql = require('mysql');
import path = require('path');
import uuid = require('node-uuid');
import app = require('../../app');
import mv = require('mv');

var poolQuery = Q.nbind<any>(pool.query, pool);

import Test = require('../structures/tests/Test');
import ReadingTest = require('../structures/tests/ReadingTest');
import MultimediaTest = require('../structures/tests/MultimediaTest');

import TestType = require('../structures/tests/TestType');
import TestCorrection = require('../structures/tests/TestCorrection');
import ReadingTestCorrection = require('../structures/tests/ReadingTestCorrection');
import MultimediaTestCorrection = require('../structures/tests/MultimediaTestCorrection');

// GET: /Tests/All/
// Params: 
// -ofType=[0, 1, 2, 3]
// -areaId
// -grade
// -professorId
// -creationDate
export function all(ofType: number, options?: { areaId?: number; grade?: number; professorId?: number; creationDate?: number }): Q.Promise<Array<Test>> {
    var parameters = [];
    // Build the sql query.
    var where = 'WHERE t.type = ' + ofType;

    if (typeof options !== 'undefined') {
        if (typeof options.areaId !== 'undefined') { parameters.push({ name: 'areaId', value: options.areaId }); }
        if (typeof options.grade !== 'undefined') { parameters.push({ name: 'grade', value: options.grade }); }
        if (typeof options.professorId !== 'undefined') { parameters.push({ name: 'professorId', value: options.professorId }); }
        if (typeof options.creationDate !== 'undefined') { where += ' AND t.creationDate > ' + options.creationDate; }
    }

    for (var i = 0; i < parameters.length; i += 1) {
        where += ' AND t.' + parameters[i].name + ' = ' + parameters[i].value;
    }

    switch (ofType) {
        case TestType.read:
        /* falls through */
        case TestType.list:
        /* falls through */
        case TestType.poem:
            return poolQuery('select t.id, t.type, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.areaId, rt.professorAudioUrl, rt.textContent from Tests as t join ReadingTests as rt on rt.id = t.id ' + where)
                .then<Array<Test>>((result) => result[0]);
        case TestType.multimedia:
            return poolQuery('SELECT t.id, t.type, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.areaId, mt.questionContent, mt.contentIsUrl, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id ' + where)
                .then<Array<Test>>((result) => result[0]);
            break;
        default:
            return Q.reject('Unknown test type.');
    }
}

/**
 * Devolve uma lista de testes multimédia, escolhidos aleatóriamente a partir da db.
 * Portado por @redroserade para usar promises.
 * 
 * @author luisfmoliveira
 */
export function random(options: { area: number; year: number; num?: number }): Q.Promise<Array<MultimediaTest>> {

    if (isNaN(options.area) || isNaN(options.year)) { return Q.reject('Invalid area or grade. They must be numbers.'); }

    var sql = 'SELECT t.id, t.type, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.areaId, mt.questionContent, mt.contentIsUrl, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id WHERE t.areaId = ' + options.area + ' AND t.grade = ' + options.year;

    console.log(sql);

    return poolQuery(sql)
        .then((results) => {
            var tests: Array<MultimediaTest> = results[0],
                aux, i, rnd,
                result = new Array<MultimediaTest>();

            //Caso o numero de perguntas que o professor quer, sobre um tema, seja igual ou superior as que existem na BD, devolve todas. Pode-se alterar por uma 
            //mensagem de erro. Fica para se decidir
            if (options.num >= tests.length) { return tests; }

            aux = 0;

            //vamos criar um teste de num perguntas random. Basicamente estou a ver quantos registos o select devolveu
            //Depois gero um numero random entre 1 e o numero de linhas
            //e devolve a pergunta que tiver o id que o random gerou (não sei se é a melhor forma...mas funciona)
            //a variavel aux é um "truque", que compara o random com o random anterior, para evitar que existam perguntas repetidas
            //caso o random seja igual ao anterior, o indice do ciclo for é "anulado", para se evitar que, imaginem 4 perguntas, 3 random eram iguais, então só ia ser devolvida uma pergunta
            //é capaz de ser confuso, sorry :S   
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
    // eg: appContent/Tests/uuid/demo.mp3
    var filePath = path.join('appContent/Tests', uuid.v4(), 'demo' + path.extname(uploadedFilePath)).replace(/\\/g, '/');

    var sql = mysql.format("CALL insertReadingTest(?,?,?,?,?,?,?,?,?)", [t.areaId, t.professorId, t.title, t.mainText, t.creationDate, t.grade, t.type, t.textContent, filePath]);

    console.log(sql);

    return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, filePath), { mkdirp: true })
        .then((_) => poolQuery(sql));
}


/**
 * Só para texto.
 */
export function createMultimediaTest(t: MultimediaTest): Q.Promise<void> {
    // Construir o caminho-base para guardar o teste.
    var basePath = 'appContent/Tests/' + uuid.v4(),
        oldOption1Path, oldOption2Path, oldOption3Path, oldQuestionContentPath;

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

    return Q.all(mvOperations)
        .then((_) => {
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


// GET + POST: /Tests/Edit/:id
export function edit(id: number) {
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
                newPath = null;

            if (typeof filePath !== 'undefined') {
                newPath = path.join('appContent', 'Tests',
                    tc.testId + '', 'Submissions',
                    tc.studentId + '',
                    tc.executionDate + path.extname(filePath)).replace(/\\/g, '/');
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
                return Q.nfcall(mv, filePath, path.join(app.rootDir, newPath), { mkdirp: true })
                    .then((_) => poolQuery(sql));
            } else {
                return poolQuery(sql);
            }
            break;
        case TestType.multimedia:
            var mtc = <MultimediaTestCorrection> tc;

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

/**
 * Returns a list of submissions for (optionally) a test, student and test.
 */
export function readingSubmissions(isCorrected = null, studentId = null, testId = null): Q.Promise<Array<TestCorrection>> {
    var sql = "select tc.testId,tc.studentId,tc.executionDate,tc.type,rtc.soundFileUrl,rtc.professorObservations,rtc.wordsPerMinute,rtc.correctWordCount,rtc.readingPrecision,rtc.readingSpeed,rtc.expressiveness,rtc.rhythm,rtc.details,rtc.wasCorrected from TestCorrections as tc join ReadingTestCorrections as rtc on tc.testId = rtc.testId and tc.studentId = rtc.studentId and tc.executionDate = rtc.executionDate where true ";

    if (isCorrected !== null) { sql += mysql.format(' and rtc.wasCorrected = ?', [isCorrected]); }
    if (studentId !== null) { sql += mysql.format(" and tc.studentId = ?", [studentId]); }
    if (testId !== null) { sql += mysql.format(" and tc.testId = ?", [testId]); }

    return poolQuery(sql)
        .then((results) => results[0]);
}

export function multimediaSubmisssions(studentId = null, testId = null): Q.Promise<Array<TestCorrection>> {
    var sql = 'select * from MultimediaTestCorrections where true ';

    if (studentId !== null) { sql += mysql.format(" and studentId = ?", [studentId]); }
    if (testId !== null) { sql += mysql.format(" and testId = ?", [testId]); }

    return poolQuery(sql)
        .then((results) => results[0]);
}

/**
 * Devolve uma lista de titulos de testes.
 * @author luisfmoliveira (Luís Oliveira)
 */
export function testTitles(professorId?: number): Q.Promise<Array<any>> {
    var sql = "select t.id, t.areaId, t.title, t.mainText, t.grade, p.name, t.professorId from Tests as t, Professors as p where t.professorId = p.id and t.type = 0";

    if (!isNaN(professorId)) {
        sql = mysql.format(sql + ' AND t.professorId = ?', [professorId]);
    }
    return poolQuery(sql)
        .then((results) => results[0]);
}

export function testDetails(testId?: number): Q.Promise<any> {
    var sql = "select r.id, r.textContent, r.professorAudioUrl, t.title from ReadingTests as r, Tests as t where r.id = t.id";

    if (!isNaN(testId)) {
        sql = mysql.format(sql + ' AND r.id = ?', [testId]);
    }

    return poolQuery(sql)
        .then((results) => results[0][0]);
}