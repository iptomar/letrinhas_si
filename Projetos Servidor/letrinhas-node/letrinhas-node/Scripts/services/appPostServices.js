var pool = require('../../configs/mysql');
var app = require('../../app');

var path = require('path');
var fs = require('fs');
var Q = require('q');
var mkdirp = require('mkdirp');

// TODO: Implement this.
function sendBinaryDataToDb(binaryData, onDone) {
    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, function (err, result) {
        console.log(result);
        onDone(err);
    });
}
exports.sendBinaryDataToDb = sendBinaryDataToDb;

function saveTestsToDb(request /*, onDone: (err: Error) => void*/ ) {
    var deferred = Q.defer();

    // TODO: Split into two, or figure out the type of resolution for each item.
    //var list: any[] = jsonData.solvedTests;
    //var insertData = [];
    //for (var i = 0; i < list.length; i++) {
    //    insertData.push(
    //        [/*list[0].id, */list[i].testId, list[i].completionDate, list[i].studentName, new Buffer(list[i].voiceBase64, 'base64')]
    //    );
    //}
    //console.log(insertData);
    //var sql = 'INSERT INTO Resolucoes (testId, completionDate, studentName, voiceData) VALUES ?';
    //var query = pool.query(sql, [insertData], (err, result) => {
    //    onDone(err);
    //});
    var test = {
        testId: request.body['testId'],
        studentId: request.body['studentId'],
        executionDate: request.body['executionDate']
    };

    switch (request.body['type']) {
        case 'read':
            test.professorObservations = request.body['observations'];
            test.wordsPerMinute = request.body['wpm'];
            test.correctWordCount = request.body['correct'];
            test.incorrectWordCount = request.body['incorrect'];
            test.readingPrecision = request.body['precision'];
            test.expressiveness = request.body['expressiveness'];
            test.rhythm = request.body['rhythm'];
            test.readingSpeed = request.body['speed'];

            // TODO: Input sanitization.
            var filePath = path.join('appContent/tests/test-' + test.testId);

            mkdirp(filePath, { mode: '777' }, function (err, made) {
                if (err) {
                    deferred.reject(err);
                } else {
                    console.log('Successfully created dir.');

                    var fileInStream = fs.createReadStream(request.files['audio'].path, { bufferSize: 4096 });
                    var fileOutStream = fs.createWriteStream(path.join(app.rootDir, filePath, request.files['audio'].originalname), { mode: '0666' });

                    fileOutStream.on('close', function () {
                        //mysqlAsync.insertQuery('', [])
                        //    .then(() => {
                        //    })
                        //    .then(() => mysqlAsync.insertQuery('', []))
                        //    .then(() => deferred.resolve(null));
                        deferred.resolve(null);
                    });
                    fileOutStream.on('error', function (err) {
                        return deferred.reject(err);
                    });

                    fileInStream.pipe(fileOutStream, { end: true });
                }
            });

            break;
        case 'multimedia':
            test.optionChosen = request.body['option'];
            break;
        default:
            // Invalid!
            deferred.reject(new Error('Invalid test type.'));
            break;
    }
    return deferred.promise;
}
exports.saveTestsToDb = saveTestsToDb;
//# sourceMappingURL=appPostServices.js.map
