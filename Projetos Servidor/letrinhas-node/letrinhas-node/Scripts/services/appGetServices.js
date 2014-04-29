/// <reference path="../typings/node/node.d.ts" />
// import mysql = require('../../configs/mysql');
var fs = require('fs');
var Q = require('q');

var pool = require('../../configs/mysql');
var mysqlAsync = require('../utils/promiseBasedMySql');

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
function getTestsNewerThan(date) {
    var deferred = Q.defer();

    var tests = new Array();

    // Get the reading tests...
    mysqlAsync.selectQuery('SELECT * FROM ReadingTests WHERE creationDate > ' + date).then(function (readingTests) {
        var tests = readingTests.rows;
        var i;

        for (i = 0; i < tests.length; i++) {
            // Populate the reading tests...
        }
    }).then(function () {
        return mysqlAsync.selectQuery('SELECT * FROM Tests WHERE creationDate > ' + date + '  JOIN ....');
    }).then(function (multimediaTests) {
        // Populate the multimedia tests...
    }).then(function () {
        return deferred.resolve(tests);
    }).fail(function (err) {
        deferred.reject(err);
    });

    return deferred.promise;
}
exports.getTestsNewerThan = getTestsNewerThan;

function getTestById(idList, onResult) {
    var sql = 'SELECT * FROM Testes WHERE id IN (' + idList.toString() + ')';

    mysqlAsync.selectQuery(sql).then(function (result) {
        var rows = result.rows;

        var data = [];

        for (var i = 0; i < rows.length; i++) {
            data.push({
                id: rows[i].id,
                title: rows[i].title,
                textContent: rows[i].textContent,
                professorName: rows[i].professorName,
                maxTries: rows[i].maxTries
            });
        }

        onResult(null, data);
    }).catch(function (err) {
        onResult(err, null);
    });
    //pool.query(sql, (err, rows, fields) => {
    //    if (err) {
    //        onResult(err, null);
    //    } else {
    //        var result = [];
    //        for (var i = 0; i < rows.length; i++) {
    //            result.push({
    //                id: rows[i].id,
    //                title: rows[i].title,
    //                textContent: rows[i].textContent,
    //                professorName: rows[i].professorName,
    //                maxTries: rows[i].maxTries,
    //            });
    //        }
    //        onResult(null, result);
    //    }
    //});
}
exports.getTestById = getTestById;

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

            for (var i = 0; i < rows.length; i++) {
                testList.push({
                    id: rows[i].id,
                    title: rows[i].title
                });
            }

            onResult(null, testList);
        }
    });
}
exports.getTestListSummaryFromDb = getTestListSummaryFromDb;

function getAllRandomTests(num, year, area, onResult) {
    //realiza a query
    mysql.pool.query("SELECT * from tbl_EscolhaMultipla where area ='" + area + "' and ano='" + year + "';", function (err, rows, fields) {
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
