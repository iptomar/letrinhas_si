var mysql = require('../../configs/mysql');

// TODO: Implement this.
function sendBinaryDataToDb(binaryData, onDone) {
    mysql.pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, function (err, result) {
        onDone(err);
    });
}
exports.sendBinaryDataToDb = sendBinaryDataToDb;

function saveTestsToDb(jsonData, onDone) {
    var list = jsonData.solvedTests;

    var insertData = [];

    for (var i = 0; i < list.length; i++) {
        insertData.push([list[i].testId, list[i].completionDate, list[i].studentName, new Buffer(list[i].voiceBase64, 'base64')]);
    }

    console.log(insertData);

    var sql = 'INSERT INTO Resolucoes (testId, completionDate, studentName, voiceData) VALUES ?';

    var query = mysql.pool.query(sql, [insertData], function (err, result) {
        onDone(err);
    });
}
exports.saveTestsToDb = saveTestsToDb;
//# sourceMappingURL=appPostServices.js.map
