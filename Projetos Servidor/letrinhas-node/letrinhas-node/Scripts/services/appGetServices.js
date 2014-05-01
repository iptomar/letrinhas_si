﻿/// <reference path="../typings/node/node.d.ts" />
// import mysql = require('../../configs/mysql');
var fs = require('fs');
var Q = require('q');

var pool = require('../../configs/mysql');

var TestType = require('../structures/tests/TestType');

function getBinaryData(onResult) {
    //mysql.pool.query('SELECT binarydata FROM BinaryTest where id = 2', (err, rows, fields) => {
    //    if (err) {
    //        onResult(err, null);
    //    } else {
    //        onResult(null, rows[0].binarydata);
    //    }
    //});
    fs.readFile('D:/z4.png', onResult);
}
exports.getBinaryData = getBinaryData;

/**
* Returns a list of tests which were created after a set date.
*/
function getTestsNewerThan(timestamp) {
    return Q.ninvoke(pool, "query", "SELECT id, professorId, title, mainText, unix_timestamp(creationDate) as creationDate, grade, type, areaId FROM Tests WHERE creationDate > from_unixtime(?)", timestamp).then(function (result) {
        return result[0];
    });
}
exports.getTestsNewerThan = getTestsNewerThan;

function getTestById(id) {
    // Make use of stored procedures to clean up our code.
    // The reason is because we need to determine the test type.
    // It's much simpler to just use a stored procedure which
    // handles all the logic for us in there.
    var options = {
        sql: 'CALL getTestById(?)',
        nestTables: false
    };

    return Q.ninvoke(pool, "query", options, id).then(function (result) {
        return result[0][0].length === 0 ? null : result[0][0];
    });
}
exports.getTestById = getTestById;

function getTests(options) {
    if (typeof options.type === 'undefined') {
        return Q.reject(new Error('No parameteres supplied!'));
    }

    var parameters = [];
    if (options.areaId !== undefined) {
        parameters.push({ name: 'areaId', value: options.areaId });
    }
    if (options.grade !== undefined) {
        parameters.push({ name: 'grade', value: options.grade });
    }
    if (options.professorId !== undefined) {
        parameters.push({ name: 'professorId', value: options.professorId });
    }

    // Build the sql query.
    var where = 'WHERE t.type = ' + options.type;

    for (var i = 0; i < parameters.length; i += 1) {
        where += ' AND t.' + parameters[i].name + ' = ' + parameters[i].value;
    }

    if (options.creationDate) {
        where += ' AND t.creationDate > from_unixtime(' + options.creationDate + ')';
    }

    switch (options.type) {
        case 0 /* read */:
            return Q.ninvoke(pool, "query", 'select t.id, t.type, t.professorId, t.title, t.mainText, unix_timestamp(t.creationDate) as creationDate, t.grade, t.areaId, rt.professorAudioUrl, rt.textContent from Tests as t join ReadingTests as rt on rt.id = t.id ' + where).then(function (result) {
                return result[0];
            });
        case 1 /* multimedia */:
            return Q.ninvoke(pool, 'query', 'SELECT t.id, t.type, t.professorId, t.title, t.mainText, UNIX_TIMESTAMP(t.creationDate) AS creationDate, t.grade, t.areaId, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, mt.option3, mt.option3IsUrl, mt.correctOption FROM Tests AS t JOIN MultimediaTests AS mt ON mt.id = t.id ' + where).then(function (result) {
                return result[0];
            });
        default:
            return Q.reject('Invalid test type');
    }
}
exports.getTests = getTests;

/**
* Gets tests from a database, and returns an array of TestSummary.
*
*/
function getTestListSummaryFromDb(max, onResult) {
    pool.query('SELECT * FROM Testes' + (max === null ? '' : ' LIMIT ' + max), function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var testList = [];

            //for (var i = 0; i < rows.length; i++) {
            //    testList.push(<TestSummary>{
            //        id: rows[i].id,
            //        title: rows[i].title
            //    });
            //}
            onResult(null, testList);
        }
    });
}
exports.getTestListSummaryFromDb = getTestListSummaryFromDb;

function getAllRandomTests(num, year, area, onResult) {
    //realiza a query
    pool.query("SELECT * from tbl_EscolhaMultipla where area ='" + area + "' and ano='" + year + "';", function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var result = [];

            //Caso o numero de perguntas que o professor quer, sobre um tema, seja igual ou superior as que existem na BD, devolve todas. Pode-se alterar por uma
            //mensagem de erro. Fica para se decidir
            if (num >= rows.length) {
                for (var i = 0; i <= rows.length; i++) {
                    result.push({
                        id: rows[i].id,
                        texto: rows[i].texto,
                        imagem1: rows[i].imagem1,
                        imagem2: rows[i].imagem2,
                        imagem3: rows[i].imagem3,
                        opcaoCorreta: rows[i].opcaoCorreta,
                        area: rows[i].area
                    });
                }
            } else {
                var aux = 0;

                for (var i = 1; i <= num; i++) {
                    var rnd = Math.floor((Math.random() * rows.length) + 1);
                    if (rnd != aux) {
                        aux = rnd;
                        result.push({
                            id: rows[rnd - 1].id,
                            texto: rows[rnd - 1].texto,
                            imagem1: rows[rnd - 1].imagem1,
                            imagem2: rows[rnd - 1].imagem2,
                            imagem3: rows[rnd - 1].imagem3,
                            opcaoCorreta: rows[rnd - 1].opcaoCorreta,
                            area: rows[rnd - 1].area
                        });
                    } else {
                        i = i - 1;
                    }
                }
            }

            onResult(null, result);
        }
    });
}
exports.getAllRandomTests = getAllRandomTests;
//# sourceMappingURL=appGetServices.js.map
