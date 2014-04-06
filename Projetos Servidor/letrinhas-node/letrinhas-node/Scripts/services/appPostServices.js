var mysql = require('../../configs/mysql');

/**
* Gets tests from a database, and returns an array of TestSummary.
*
*/
function getTestListSummaryFromDb(max, onResult) {
    mysql.pool.query('SELECT * FROM Testes' + (max === null ? '' : ' LIMIT ' + max), function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            var testList = [];

            for (var i = 0; i < rows.length; i++) {
                testList.push({
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
exports.getTestListSummaryFromDb = getTestListSummaryFromDb;

// TODO: Implement this.
function sendBinaryDataToDb(binaryData, onDone) {
    mysql.pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, function (err, result) {
        onDone(err);
    });
}
exports.sendBinaryDataToDb = sendBinaryDataToDb;
//# sourceMappingURL=appPostServices.js.map
