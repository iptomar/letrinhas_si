var mysql = require('../../configs/mysql');

function getBinaryData(onResult) {
    mysql.pool.query('SELECT binarydata FROM BinaryTest where id = 1', function (err, rows, fields) {
        if (err) {
            onResult(err, null);
        } else {
            onResult(null, rows[0].binarydata);
        }
    });
    //fs.readFile('D:/z4.png', onResult);
}
exports.getBinaryData = getBinaryData;
//# sourceMappingURL=appGetServices.js.map
