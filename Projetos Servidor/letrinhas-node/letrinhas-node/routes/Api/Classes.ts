/*
 * Routes related to classes.
 */

import express = require('express');

import service = require('../../Scripts/services/classService');
import Class = require('../../Scripts/structures/schools/Class');
import schoolService = require('../../Scripts/services/schoolService');


export function mapRoutes(app: express.Express) {
    app.get('/Api/Classes/All', function (req, res) {
        service.all()
            .then((classes) => res.json(classes))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    console.log('GET /Classes/All ->', 'service.all');

    app.get('/Api/Classes/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

        if (isNaN(id)) { res.status(400).json({ error: 400 }); }

        service.details(id)
            .then((classDetails) => {
                if (classDetails === null) { return res.status(404).json({ error: 404 }); }

                res.json(classDetails);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    app.get('/Api/Classes/Students/:id', function (req, res) {
        throw 'NYI';
        // TODO
    });


    app.get('/Api/Classes/Professors/:id?', function (req, res) {
        var id;

        if (typeof req.params.id !== 'undefined') {
            id = parseInt(req.params.id);

            if (isNaN(id)) { return res.status(400).end({ error: 400 }); }
        }

        service.professors(id)
            .then((professors) => res.json(professors))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    console.log('GET /Classes/Professors ->', service.professors);


}