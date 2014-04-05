import letrinhasDataStructures = require('../structures/testDataStructures');
import mysql = require('../../configs/mysql');
import tests = require('../structures/testDataStructures');

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
                    title: rows[i].title,
                    text: rows[i].textContent.toString(),
                    maxTries: rows[i].maxTries
                });
            }

            onResult(null, testList);
        }
    });
}

// TODO: Implement this.
export function sendBinaryDataToFile(onDone: (err: Error, result: any) => void) {

}