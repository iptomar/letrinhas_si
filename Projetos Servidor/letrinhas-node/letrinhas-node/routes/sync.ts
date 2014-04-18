import syncServices = require('../Scripts/services/syncServices');
import express = require('express');

export function getProfessors(request: express.Request, response: express.Response) {
    syncServices.getProfessors((err, data) => {
        if (err) {
            response.statusCode = 500;
            response.json({
                professors: []
            });
            return;
        }

        response.json({
            professors: data
        });
    });
}