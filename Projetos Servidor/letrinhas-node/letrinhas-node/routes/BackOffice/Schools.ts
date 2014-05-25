import express = require('express');

import service = require('../../Scripts/services/schoolService');
import School = require('../../Scripts/structures/schools/School');


export function mapRoutes(app: express.Express) {
    app.all('/BackOffice/Schools/Create', function (req, res) {
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

    app.all('/BackOffice/Schools/Edit/:id', function (req, res) {
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

    app.get('/BackOffice/Schools/GetAll', function (req, res) {
        service.getAllSchools(function (err, result) {
            res.render('schoolList', {
                title: 'Lista de escolas',
                items: result
            });
        }); 
    });
}