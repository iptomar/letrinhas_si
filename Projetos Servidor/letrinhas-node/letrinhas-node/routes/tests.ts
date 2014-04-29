/// <reference path="../Scripts/typings/express/express.d.ts" />
/// <reference path="../Scripts/typings/node/node.d.ts" />

import express = require('express');
import fs = require('fs');
import Q = require('q');
import path = require('path');


import appPostServices = require('../Scripts/services/appPostServices');
import appGetServices = require('../Scripts/services/appGetServices');



export function listSummary(request: express.Request, response: express.Response): void {

    var max = parseInt(request.param('max'));

    max = isNaN(max) ? null : max;

    appGetServices.getTestListSummaryFromDb(max, (err, list) => {
        response.set('Content-Type', 'application/json');
        response.charset = 'utf-8';
        if (err) {
            response.statusCode = 500;
            response.send(JSON.stringify({
                success: 0,
                reason: err.message
            }));
        } else {
            response.send(JSON.stringify({
                tests: list,
                success: 1
            }));
        }
    });
}

export function getImage(request: express.Request, response: express.Response) {
    appGetServices.getBinaryData((err, result) => {
        //response.type('json');
        //response.end(JSON.stringify({
        //    id: 1,
        //    title: 'Um carrinho bonito',
        //    image: result.toString('base64'),
        //    success: 1
        //}));

        response.end(result);
    });
    console.log("Hello");
}

export function postImage(request: express.Request, response: express.Response) {

    // console.log(request);

    var correctId: string = request.body['correct-id'];

    //// Read the file
    //fs.readFile(request.files[correctId].path, (err, data) => {
    //    appPostServices.sendBinaryDataToDb(data, (err) => {
    //        if (err) {
    //            console.log(err);
    //        }

    //        response.end('Whatever');
    //    });
    //});

    // console.log(request.body);

    //fs.readFile(request.files[correctId].path, (err, data) => {
    //    fs.writeFile('D:/' + request.files[correctId].path, data, (err) => {
    //        console.log('Saved file.');
    //    });
    //});

    console.log(correctId);

    console.log(request.files);

    response.end('Whatever');
}

export function teste(request: express.Request, response: express.Response) {
    console.log(request.url);

    response.render('teste', {
        title: "Isto é um teste",
        pessoa: "André Carvalho"
    });
}

export function getTest(request: express.Request, response: express.Response) {

    if (request.query.hasOwnProperty('id')) {
        var idListAsString: string[] = request.query['id'].split(',');
        var idList = [];

        for (var i = 0; i < idListAsString.length; i++) {
            var id = parseInt(idListAsString[i]);

            if (!isNaN(id)) {
                idList.push(id);
            }
        }

        if (idList.length == 0) {
            response.statusCode = 400;
            response.end('No valid id supplied.');
        } else {
            appGetServices.getTestById(idList, (err, testList) => {
                response.json({
                    tests: testList,
                    success: 1
                });
            });
        }
    } else if (request.query.hasOwnProperty('lastSyncDate')) {

    } else {
        response.statusCode = 400;
        response.end("No id supplied.");
    }
}

//função que devolve um teste com perguntas random
export function getRandomTest(request: express.Request, response: express.Response) {
    //em querystring vem o numero de perguntas que se pretende, o ano e a area
    var num: number = request.query['num'];
    var year: number = request.query['ano'];
    var area: String = request.query['area']; 

    if (isNaN(num) || isNaN(year)) {
        response.end("Number or Year invalid.");
    }
    else {
        appGetServices.getAllRandomTests(num, year, area, (err, testlist) => {
            var sendResult = {
                tests: testlist,
                success: 1
            };

            response.end(JSON.stringify(sendResult));
        });
    }

   
}


export function postTestResults(request: express.Request, response: express.Response) {
    // console.log(request.body);

    // TODO: Figure out a structure for the POST. It could be done 1 by 1,
    // or multiple at a time.

    // Fields:
    // * execution-date: The date on which the test was done. String, formatted as dd-mm-yyyy (hh:mm ???)
    // * test-id: The ID of the test. Integer, higher than 0.
    // * student-id: The ID of the student. Integer, higher than 0.
    // * type: String Enum, values: read, multimedia (? Could get the type from the DB)

    // * (If type is multimedia) 
    //   * option: The option which was chosen.Integer, values = 1, 2, or 3.

    // * (If type is read):
    //   * observations: Professor observations. String.
    //   * wpm: Words per minute. Number.
    //   * correct: Correct word count: Integer.
    //   * precision: Reading precision. Number.
    //   * speed: Reading speed. Number.
    //   * expressiveness: The student's expressiveness. Number.
    //   * rhythm: The student's rhythm. Number.
    //   * incorrect: Incorrect word count. Integer.
    //   * audio: The audio for the recording. File.


    appPostServices.saveTestsToDb(request)
        .then(() => response.json({ success: 1 }))
        .catch((err) => {
            response.statusCode = 500;
            response.json({ success: 0, reason: err.toString() })
        });
}

