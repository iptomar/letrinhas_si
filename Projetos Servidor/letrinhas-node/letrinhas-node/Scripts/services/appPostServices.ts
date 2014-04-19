import pool = require('../../configs/mysql');

import TestSummary = require('../structures/tests/TestSummary');


// TODO: Implement this.
export function sendBinaryDataToDb(binaryData: NodeBuffer, onDone: (err: Error) => void) {
    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, (err, result) => {
        console.log(result);
        onDone(err);
    });
}

export function saveTestsToDb(jsonData: any, onDone: (err: Error) => void) {
    // TODO: Split into two, or figure out the type of resolution for each item.

    var list: any[] = jsonData.solvedTests;

    var insertData = [];

    for (var i = 0; i < list.length; i++) {
        insertData.push(
            [/*list[0].id, */list[i].testId, list[i].completionDate, list[i].studentName, new Buffer(list[i].voiceBase64, 'base64')]
        );
    }

    console.log(insertData);

    var sql = 'INSERT INTO Resolucoes (testId, completionDate, studentName, voiceData) VALUES ?';

    var query = pool.query(sql, [insertData], (err, result) => {
        onDone(err);
    });
}