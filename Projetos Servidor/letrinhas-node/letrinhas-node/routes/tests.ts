/// <reference path="../Scripts/typings/express/express.d.ts" />
/// <reference path="../Scripts/typings/node/node.d.ts" />

import express = require('express');
import fs = require('fs');

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

    fs.readFile(request.files[correctId].path, (err, data) => {
        fs.writeFile('D:/' + request.files[correctId].path, data, (err) => {
            console.log('Saved file.');
        });
    });

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
    } else {
        response.statusCode = 400;
        response.end("No id supplied.");
    }
}

export function postTestResults(request: express.Request, response: express.Response) {
    console.log(request.body);

    appPostServices.saveTestsToDb(request.body, (err) => {
        if (err) {
            response.statusCode = 500;
            console.log(err.message);

            response.json({
                success: 0
            });
        } else {
            response.json({
                success: 1
            });
        }
    });
}