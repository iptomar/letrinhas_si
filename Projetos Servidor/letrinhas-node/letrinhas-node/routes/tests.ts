///reference path="../typings/express/express.d.ts"/>

import express = require('express');
import fs = require('fs');

import appPostServices = require('../Scripts/services/appPostServices');
import appGetServices = require('../Scripts/services/appGetServices');

export function listSummary(request: express.Request, response: express.Response) {

    var max = parseInt(request.param('max'));

    max = isNaN(max) ? null : max;

    appPostServices.getTestListSummaryFromDb(max, (err, list) => {
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
        response.type('json');
        response.end(JSON.stringify({
            id: 1,
            data: result.toString('base64')
        }));

        // response.end(result);
    });
}

export function postImage(request: express.Request, response: express.Response) {

    var correctId: string = request.body['correct-id'];

    // Read the file
    fs.readFile(request.files[correctId].path, (err, data) => {
        appPostServices.sendBinaryDataToDb(data, (err) => {
            if (err) {
                console.log(err);
            }

            response.end('Whatever');
        });
    });

    

    console.log(correctId);

    console.log(request.files[correctId]);

    
}