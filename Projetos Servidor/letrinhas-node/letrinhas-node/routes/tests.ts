///reference path="../typings/express/express.d.ts"/>

import express = require('express');
import appPostServices = require('../Scripts/services/appPostServices');

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
            response.send(JSON.stringify(list));
        }

        
    });
}