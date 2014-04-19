/// <reference path="../typings/node/node.d.ts" />

// import mysql = require('../../configs/mysql');
import fs = require('fs');
import mysql = require('../../configs/mysql');
import tests = require('../structures/testDataStructures');

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

    //var listResult = [];

    //for (var i = 0; i < idList.length; i++) {
    //    listResult.push({
    //        id: idList[i],
    //        title: 'Teste ' + i
    //    });
    //}

    //onResult(null, listResult);

    var sql = 'SELECT * FROM Testes WHERE id IN (' + idList.toString() + ')';

    mysql.pool.query(sql, (err, rows, fields) => {
        if (err) {
            onResult(err, null);
        } else {

            var result = [];

            for (var i = 0; i < rows.length; i++) {
                result.push({
                    id: rows[i].id,
                    title: rows[i].title,
                    textContent: rows[i].textContent,
                    professorName: rows[i].professorName,
                    maxTries: rows[i].maxTries,
                });
            }

            onResult(null, result);
        }
    });
}

/**
 * Gets tests from a database, and returns an array of TestSummary.
 * 
 */
export function getTestListSummaryFromDb(max: number, onResult: (err: Error, summaryList: tests.TestSummary[]) => void) {
    mysql.pool.query('SELECT * FROM Testes' + (max === null ? '' : ' LIMIT ' + max), (err, rows, fields) => {
        if (err) {
            onResult(err, null);
        } else {
            var testList: tests.TestSummary[] = [];

            for (var i = 0; i < rows.length; i++) {
                testList.push(<tests.TestSummary>{
                    id: rows[i].id,
                    title: rows[i].title
                });
            }

            onResult(null, testList);
        }
    });
}