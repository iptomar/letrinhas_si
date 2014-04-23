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
//# sourceMappingURL=appGetServices.js.map
