// import mysql = require('../../configs/mysql');
var fs = require('fs');
var mysql = require('../../configs/mysql');

function getBinaryData(onResult) {
    //mysql.pool.query('SELECT binarydata FROM BinaryTest where id = 1', (err, rows, fields) => {
    //    if (err) {
    //        onResult(err, null);
    //    } else {
    //        onResult(null, rows[0].binarydata);
    //    }
    //});
    fs.readFile('D:/z4.png', onResult);
}
exports.getBinaryData = getBinaryData;

function getTestById(idList, onResult) {
    //var listResult = [];
    //for (var i = 0; i < idList.length; i++) {
    //    listResult.push({
    //        id: idList[i],
    //        title: 'Teste ' + i
    //    });
    //}
    //onResult(null, listResult);
    var sql = 'SELECT * FROM Testes WHERE id IN (' + idList.toString() + ')';

    mysql.pool.query(sql, function (err, rows, fields) {
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
                    maxTries: rows[i].maxTries
                });
            }

            onResult(null, result);
        }
    });
}
exports.getTestById = getTestById;

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
                    title: rows[i].title
                });
            }

            onResult(null, testList);
        }
    });
}
exports.getTestListSummaryFromDb = getTestListSummaryFromDb;
//# sourceMappingURL=appGetServices.js.map
