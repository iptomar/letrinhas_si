///reference path="../typings/express/express.d.ts"/>

import express = require('express');
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
        response.end(result);
    });
}

export function postImage(request: express.Request, response: express.Response) {
    var correctId: string = request.body['correct-id'];

    console.log(correctId);

    console.log(request.files[correctId]);

    response.end('Whatever');
}