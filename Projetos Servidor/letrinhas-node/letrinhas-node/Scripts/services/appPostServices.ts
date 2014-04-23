import pool = require('../../configs/mysql');

import path = require('path');
import fs = require('fs');
import Q = require('q');

import mysqlAsync = require('../utils/promiseBasedMySql');

import TestSummary = require('../structures/tests/TestSummary');

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

export function saveTestsToDb(request: any, onDone: (err: Error) => void) {
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

    var test = <TestCorrection> {
        testId: request.body['testId'],
        studentId: request.body['studentId'],
        executionDate: request.body['executionDate']
    };

    switch (request.body['type']) {

        case 'read':
            (<ReadingTestCorrection> test).professorObservations = request.body['observations'];
            (<ReadingTestCorrection> test).wordsPerMinute = request.body['wpm'];
            (<ReadingTestCorrection> test).correctWordCount = request.body['correct'];
            (<ReadingTestCorrection> test).incorrectWordCount = request.body['incorrect'];
            (<ReadingTestCorrection> test).readingPrecision = request.body['precision'];
            (<ReadingTestCorrection> test).expressiveness = request.body['expressiveness'];
            (<ReadingTestCorrection> test).rhythm = request.body['rhythm'];
            (<ReadingTestCorrection> test).readingSpeed = request.body['speed'];

            console.log(test);

            // TODO: Input sanitization.
            var filePath = path.join('D:', /*'appContent/tests/test-' + test.testId,*/ request.files['audio'].originalname);

            console.log(filePath);

            // Save the audio file.
            Q.nfcall<NodeBuffer>(fs.readFile, request.files['audio'].path)
                .then((fileData) => {
                    console.log('Read file from the client!');

                    // TODO: Change this to use a var.
                    Q.nfcall(fs.writeFile, filePath, fileData)
                        .then(() => {
                            console.log('Saved file on ' + filePath);
                            onDone(null);
                            //    mysqlAsync.insertQuery('INSERT INTO WhateverTable (testId, studentId, ...) VALUES ?', [test]).then(() => onDone(null));
                        })

                })
                .fail((err) => {
                    console.log(err);
                    onDone(err);
                });

            break;
        case 'multimedia':
            (<MultimediaTestCorrection> test).optionChosen = request.body['option'];
            break;
        default:
            onDone(new Error('Invalid'));
            // Invalid!
            break;
    }

}