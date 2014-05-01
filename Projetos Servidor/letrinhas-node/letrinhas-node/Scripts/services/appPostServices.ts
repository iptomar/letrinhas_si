import pool = require('../../configs/mysql');
import app = require('../../app');


import path = require('path');
import fs = require('fs');
import Q = require('q');
import mkdirp = require('mkdirp');
import async = require('async');
import mysql = require('mysql');

import TestSummary = require('../structures/tests/TestSummary');
import TestType = require('../structures/tests/TestType');

import TestCorrection = require('../structures/tests/TestCorrection');
import MultimediaTestCorrection = require('../structures/tests/MultimediaTestCorrection');
import ReadingTestCorrection = require('../structures/tests/ReadingTestCorrection');

// TODO: Implement this.
export function sendBinaryDataToDb(binaryData: NodeBuffer, onDone: (err: Error) => void) {
    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, (err, result) => {
        console.log(result);
        onDone(err);
    });
}

export function saveTestCorrection(c: TestCorrection, uploadedFilePath?: string, uploadedFileName?: string): Q.Promise<void> {
    if (c === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    switch (c.type) {
        case TestType.read:
            var filePath = path.join('appContent/tests/test-' + c.testId),
                fileName = path.join(filePath, uploadedFileName);

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

            console.log(sql);

            return Q.nfcall<void>(mkdirp, filePath, { mode: parseInt('777', 8) })
                .then((made) => _saveFile(uploadedFilePath, fileName))
                .then((_) => Q.ninvoke<void>(pool, "query", sql));

        case TestType.multimedia:
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                (<MultimediaTestCorrection> c).optionChosen,
                (<MultimediaTestCorrection> c).isCorrect
            ];

            return Q.ninvoke<void>(pool, "query", "CALL insertReadingTestCorrection(" + args.toString() + ")");

        default:
            return Q.reject('Unknown value for correction.type.');
    }
}

function _saveFile(fileName: string, filePath: string): Q.Promise<void> {
    var deferred = Q.defer<void>();

    var fileInStream = fs.createReadStream(fileName, { bufferSize: 4096 });
    var fileOutStream = fs.createWriteStream(filePath, { mode: parseInt('666', 8) });

    fileOutStream.on('close', () => deferred.resolve(null));
    fileOutStream.on('error', (err) => deferred.reject(err));

    fileInStream.pipe(fileOutStream, { end: true });

    return deferred.promise;
}