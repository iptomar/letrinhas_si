import express = require('express');

import service = require('../Scripts/services/schoolService');
import School = require('../Scripts/structures/schools/School');

export function mapRoutes(app: express.Express) {

    app.get('/Schools/All', function (req, res) {
        service.all()
            .then((schools) => res.json(schools))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    app.get('/Schools/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

        if (isNaN(id)) { res.status(400).json({ error: 400 }); }

        service.details(id)
            .then((school) => {
                if (school === null) { return res.status(404).json({ error: 404 }); }

                res.json(school);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    app.all('/Schools/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                return res.render('addSchool');
            case 'POST':
                var body = req.body;
                var school = <School> {
                    schoolName: body.schoolName,
                    schoolAddress: body.schoolAddress,
                    schoolLogoUrl: body.photo
                };

                service.createSchool(school, req.files.photo.path)
                    .then((_) => res.end('Dados inseridos com sucesso!'))
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: 500 })
                });
                break;
            default:
                res.status(404).json({ error: 404 });
        }
    });

    app.all('/Schools/Edit/:id', function (req, res) {
        // TODO
        throw 'NYI';

        switch (req.method) {
            case 'GET':
                break;
            case 'POST':
                break;
            default:
                res.status(404).json({ error: 404 });
        }
    });
}