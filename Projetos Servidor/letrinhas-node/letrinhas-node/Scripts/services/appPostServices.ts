import pool = require('../../configs/mysql');
import app = require('../../app');


import path = require('path');
import fs = require('fs');
import Q = require('q');
import mkdirp = require('mkdirp');
import mysql = require('mysql');
import mv = require('mv');

import TestSummary = require('../structures/tests/TestSummary');
import TestType = require('../structures/tests/TestType');

import TestCorrection = require('../structures/tests/TestCorrection');
import MultimediaTestCorrection = require('../structures/tests/MultimediaTestCorrection');
import ReadingTestCorrection = require('../structures/tests/ReadingTestCorrection');

var poolQuery = Q.nbind(pool.query, pool);

// TODO: Implement this.
//export function sendBinaryDataToDb(binaryData: NodeBuffer, onDone: (err: Error) => void) {
//    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, (err, result) => {
//        console.log(result);
//        onDone(err);
//    });
//}

export function saveTestCorrection(c: TestCorrection, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<any> {
    if (c === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    switch (c.type) {
        case TestType.read:

            var filePath = path.join('appContent/tests/test-' + c.testId),
                fileName = path.join(filePath, c.studentId + '-' + c.executionDate + uploadedFileName.substring(uploadedFileName.lastIndexOf('.')));

            // I don't like this.
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                pool.escape(fileName.replace(/\\/g, '/')),
                pool.escape((<ReadingTestCorrection>c).professorObservations),
                (<ReadingTestCorrection>c).wordsPerMinute,
                (<ReadingTestCorrection>c).correctWordCount,
                (<ReadingTestCorrection>c).readingPrecision,
                (<ReadingTestCorrection>c).readingSpeed,
                (<ReadingTestCorrection>c).expressiveness,
                (<ReadingTestCorrection>c).rhythm,
                pool.escape((<ReadingTestCorrection>c).details)
            ];

            var sql = "CALL insertReadingTestCorrection(" + args.toString() + ")";

            return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true })
                .then((_) => poolQuery(sql));

        case TestType.multimedia:
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                (<MultimediaTestCorrection> c).optionChosen,
                (<MultimediaTestCorrection> c).isCorrect
            ];

            return poolQuery("CALL insertReadingTestCorrection(" + args.toString() + ")");

        default:
            return Q.reject('Unknown value for correction.type.');
    }
}

/**
 * @{deprecated} Pointless.
 */
function _saveFile(fileName: string, filePath: string): Q.Promise<void> {
    var deferred = Q.defer<void>();

    var fileInStream = fs.createReadStream(fileName, { bufferSize: 4096 });
    var fileOutStream = fs.createWriteStream(filePath, { mode: parseInt('666', 8) });

    fileOutStream.on('close', () => deferred.resolve(null));
    fileOutStream.on('error', (err) => deferred.reject(err));

    fileInStream.pipe(fileOutStream, { end: true });

    return deferred.promise;
}