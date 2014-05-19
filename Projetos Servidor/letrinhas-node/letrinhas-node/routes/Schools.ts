import express = require('express');

import service = require('../Scripts/services/schoolService');
import School = require('../Scripts/structures/schools/School');

export function mapRoutes(app: express.Express) {

    app.get('/Schools/All', function (req, res) {
        service.all()
            .then((schools) => res.json(schools))
            .catch((_) => res.status(500).json({ error: 500 }));
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
                    .catch((err) => res.end('error: ' + err.toString()));
            default:
                res.status(404).json({ error: 404 });
        }
    });

    app.all('/Schools/Edit/:id', function (req, res) {
        throw 'NYI';

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
                    .catch((err) => res.end('error: ' + err.toString()));
            default:
                res.status(404).json({ error: 404 });
        }
    });
}