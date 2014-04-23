var pool = require('../../configs/mysql');

var path = require('path');
var fs = require('fs');
var Q = require('q');

// TODO: Implement this.
function sendBinaryDataToDb(binaryData, onDone) {
    pool.query('INSERT INTO BinaryTest SET binarydata = ?', binaryData, function (err, result) {
        console.log(result);
        onDone(err);
    });
}
exports.sendBinaryDataToDb = sendBinaryDataToDb;

function saveTestsToDb(request, onDone) {
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

            console.log(test);

            // TODO: Input sanitization.
            var filePath = path.join('D:', request.files['audio'].originalname);

            console.log(filePath);

            // Save the audio file.
            Q.nfcall(fs.readFile, request.files['audio'].path).then(function (fileData) {
                console.log('Read file from the client!');

                // TODO: Change this to use a var.
                Q.nfcall(fs.writeFile, filePath, fileData).then(function () {
                    console.log('Saved file on ' + filePath);
                    onDone(null);
                    //    mysqlAsync.insertQuery('INSERT INTO WhateverTable (testId, studentId, ...) VALUES ?', [test]).then(() => onDone(null));
                });
            }).fail(function (err) {
                console.log(err);
                onDone(err);
            });

            break;
        case 'multimedia':
            test.optionChosen = request.body['option'];
            break;
        default:
            onDone(new Error('Invalid'));

            break;
    }
}
exports.saveTestsToDb = saveTestsToDb;
//# sourceMappingURL=appPostServices.js.map
