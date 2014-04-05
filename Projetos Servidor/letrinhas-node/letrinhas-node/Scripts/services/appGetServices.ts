import mysql = require('../../configs/mysql');

export function getBinaryData(onResult: (err: Error, result: NodeBuffer) => void) {
    mysql.pool.query('SELECT binarydata FROM BinaryTest where id = 1', (err, rows, fields) => {
        if (err) {
            onResult(err, null);
        } else {
            onResult(null, new Buffer(rows[0].binarydata, 'binary'));
        }
    });
}