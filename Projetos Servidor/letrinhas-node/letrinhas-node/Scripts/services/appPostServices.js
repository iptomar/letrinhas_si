var pool = require('../../configs/mysql');
var app = require('../../app');

var path = require('path');
var fs = require('fs');
var Q = require('q');

var mv = require('mv');

var TestType = require('../structures/tests/TestType');

var poolQuery = Q.nbind(pool.query, pool);

// TODO: Implement this.
//export function sendBinaryDataToDb(binaryData: NodeBuffer, onDone: (err: Error) => void) {
//    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, (err, result) => {
//        console.log(result);
//        onDone(err);
//    });
//}
function saveTestCorrection(c, uploadedFilePath, uploadedFileName) {
    if (c === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    switch (c.type) {
        case 0 /* read */:
            var filePath = path.join('appContent/tests/test-' + c.testId), fileName = path.join(filePath, c.studentId + '-' + c.executionDate + uploadedFileName.substring(uploadedFileName.lastIndexOf('.')));

            // I don't like this.
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                pool.escape(fileName.replace(/\\/g, '/')),
                pool.escape(c.professorObservations),
                c.wordsPerMinute,
                c.correctWordCount,
                c.readingPrecision,
                c.readingSpeed,
                c.expressiveness,
                c.rhythm,
                pool.escape(c.details)
            ];

            var sql = "CALL insertReadingTestCorrection(" + args.toString() + ")";

            return Q.nfcall(mv, uploadedFilePath, path.join(app.rootDir, fileName), { mkdirp: true }).then(function (_) {
                return poolQuery(sql);
            });

        case 1 /* multimedia */:
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                c.optionChosen,
                c.isCorrect
            ];

            return poolQuery("CALL insertReadingTestCorrection(" + args.toString() + ")");

        default:
            return Q.reject('Unknown value for correction.type.');
    }
}
exports.saveTestCorrection = saveTestCorrection;

/**
* @{deprecated} Pointless.
*/
function _saveFile(fileName, filePath) {
    var deferred = Q.defer();

    var fileInStream = fs.createReadStream(fileName, { bufferSize: 4096 });
    var fileOutStream = fs.createWriteStream(filePath, { mode: parseInt('666', 8) });

    fileOutStream.on('close', function () {
        return deferred.resolve(null);
    });
    fileOutStream.on('error', function (err) {
        return deferred.reject(err);
    });

    fileInStream.pipe(fileOutStream, { end: true });

    return deferred.promise;
}
//# sourceMappingURL=appPostServices.js.map
