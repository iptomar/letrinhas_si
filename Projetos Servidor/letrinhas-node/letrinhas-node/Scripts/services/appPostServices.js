var pool = require('../../configs/mysql');

var path = require('path');
var fs = require('fs');
var Q = require('q');
var mkdirp = require('mkdirp');

var TestType = require('../structures/tests/TestType');

// TODO: Implement this.
function sendBinaryDataToDb(binaryData, onDone) {
    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, function (err, result) {
        console.log(result);
        onDone(err);
    });
}
exports.sendBinaryDataToDb = sendBinaryDataToDb;

function saveTestCorrection(c, uploadedFilePath, uploadedFileName) {
    if (c === null) {
        return Q.reject(new Error('correction cannot be null.'));
    }

    switch (c.type) {
        case 0 /* read */:
            var filePath = path.join('appContent/tests/test-' + c.testId), fileName = path.join(filePath, uploadedFileName);

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

            console.log(sql);

            return Q.nfcall(mkdirp, filePath, { mode: parseInt('777', 8) }).then(function (made) {
                return _saveFile(uploadedFilePath, fileName);
            }).then(function (_) {
                return Q.ninvoke(pool, "query", sql);
            });

        case 1 /* multimedia */:
            var args = [
                c.testId,
                c.studentId,
                c.executionDate,
                c.optionChosen,
                c.isCorrect
            ];

            return Q.ninvoke(pool, "query", "CALL insertReadingTestCorrection(" + args.toString() + ")");

        default:
            return Q.reject('Unknown value for correction.type.');
    }
}
exports.saveTestCorrection = saveTestCorrection;

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
