import letrinhasDataStructures = require('../structures/testDataStructures');
import mysql = require('../../configs/mysql');

// TODO: Implement this.
export function sendBinaryDataToDb(binaryData: NodeBuffer, onDone: (err: Error) => void) {
    mysql.pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, (err, result) => {
        onDone(err);
    });
}