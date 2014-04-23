/// <reference path="../typings/node/node.d.ts" />

// import mysql = require('../../configs/mysql');
import fs = require('fs');
import Q = require('q');

import pool = require('../../configs/mysql');
import mysqlAsync = require('../utils/promiseBasedMySql');

import TestSummary = require('../structures/tests/TestSummary');
import Test = require('../structures/tests/Test');
import ReadingTest = require('../structures/tests/ReadingTest');
import MultimediaTest = require('../structures/tests/MultimediaTest');


export function getBinaryData(onResult: (err: Error, result: NodeBuffer) => void) {
    //mysql.pool.query('SELECT binarydata FROM BinaryTest where id = 2', (err, rows, fields) => {
    //    if (err) {
    //        onResult(err, null);
    //    } else {
    //        onResult(null, rows[0].binarydata);
    //    }
    //});

    fs.readFile('D:/z4.png', onResult);
}

/**
 * Returns a list of tests which were created after a set date.
 */
export function getTestsNewerThan(date: string): Q.Promise<Array<Test>> {

    var deferred = Q.defer<Array<Test>>();

    var tests = new Array<Test>();

    // Get the reading tests...
    mysqlAsync.selectQuery('SELECT * FROM ReadingTests WHERE creationDate > ' + date)
        .then((readingTests) => {
            var tests: Array<Test> = readingTests.rows;
            var i;

            for (i = 0; i < tests.length; i++) {
                // Populate the reading tests...
            }
        })
    // Get the multimedia tests...
        .then(() => mysqlAsync.selectQuery('SELECT * FROM Tests WHERE creationDate > ' + date + '  JOIN ....'))
        .then((multimediaTests) => {
            // Populate the multimedia tests...
        })
    // All went well.
        .then(() => deferred.resolve(tests))
    // Something went wrong.
        .fail((err) => {
            deferred.reject(err);
        });

    return deferred.promise;
}

export function getTestById(idList: number[], onResult: (err: Error, result: Array<any>) => void) {
    var sql = 'SELECT * FROM Testes WHERE id IN (' + idList.toString() + ')';

    mysqlAsync.selectQuery(sql)
        .then((result) => {
            var rows = result.rows;

            var data = [];

            for (var i = 0; i < rows.length; i++) {
                data.push({
                    id: rows[i].id,
                    title: rows[i].title,
                    textContent: rows[i].textContent,
                    professorName: rows[i].professorName,
                    maxTries: rows[i].maxTries,
                });
            }

            onResult(null, data);
        })
        .catch((err) => {
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

/**
 * Gets tests from a database, and returns an array of TestSummary.
 * 
 */
export function getTestListSummaryFromDb(max: number, onResult: (err: Error, summaryList: TestSummary[]) => void) {
    pool.query('SELECT * FROM Testes' + (max === null ? '' : ' LIMIT ' + max), (err, rows, fields) => {
        if (err) {
            onResult(err, null);
        } else {
            var testList: TestSummary[] = [];

            for (var i = 0; i < rows.length; i++) {
                testList.push(<TestSummary>{
                    id: rows[i].id,
                    title: rows[i].title
                });
            }

            onResult(null, testList);
        }
    });
}