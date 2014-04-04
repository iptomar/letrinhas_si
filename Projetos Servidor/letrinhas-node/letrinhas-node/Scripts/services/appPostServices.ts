import letrinhasDataStructures = require('../structures/testDataStructures');
import mysql = require('../configs/mysql');

/**
 * Gets tests from a database, and returns an array of TestSummary.
 * 
 */
export function getTestListSummaryFromDb(max: number, onResult: (err: Error, summaryList: any) => void) {
    mysql.pool.query('SELECT * FROM Testes' + (max === null ? '' : ' LIMIT ' + max), (err, rows, fields) => {
        if (err) {
            onResult(err, null);
        } else {
            var result = {
                tests: [],
                success: 1
            }

            for (var i = 0; i < rows.length; i++) {
                result.tests.push({
                    id: rows[i].id,
                    title: rows[i].title,
                    text: rows[i].textContent.toString(),
                    maxTries: rows[i].maxTries
                });
            }

            onResult(null, result);
        }

        
    });
}