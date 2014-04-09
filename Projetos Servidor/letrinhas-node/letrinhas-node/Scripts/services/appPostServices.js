var mysql = require('../../configs/mysql');

// TODO: Implement this.
function sendBinaryDataToDb(binaryData, onDone) {
    mysql.pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, function (err, result) {
        onDone(err);
    });
}
exports.sendBinaryDataToDb = sendBinaryDataToDb;
//# sourceMappingURL=appPostServices.js.map
