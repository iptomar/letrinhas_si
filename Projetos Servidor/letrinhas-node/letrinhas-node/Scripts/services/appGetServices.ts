/// <reference path="../typings/node/node.d.ts" />

// import mysql = require('../../configs/mysql');
import fs = require('fs');
import pool = require('../../configs/mysql');
import mysqlAsync = require('../utils/promiseBasedMySql');
import TestSummary = require('../structures/tests/TestSummary');

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