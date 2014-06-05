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

    app.all('/BackOffice/Schools/Edit', function (req, res) {
        // TODO
        switch (req.method) {
            case 'GET':
                // objecto de opções.
                var options = Object.create(null);

                // Verificar se temos um id de escola válido. Ignoramo-lo se não for
                if (!isNaN(req.query.schoolId)) {
                    options.schoolId = parseInt(req.query.schoolId, 10);
                }

                // Obtemos a informação da escola
                service.schoolDetails(options.schoolId)
                    .then((schoolDetails) => {
                        res.render('editSchool', {
                            title: 'Detalhes' + (typeof options.schoolId !== 'undefined' ? ' da escola ' + schoolDetails[0].schoolName : ''),
                            items: schoolDetails
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        // TODO: Uma view de 500.
                        res.status(500).render('Erros/500');
                    });
                break;
            case 'POST':
                var body = req.body;
                var school = <School> {
                    schoolName: body.schoolName,
                    schoolAddress: body.schoolAddress,
                    id: body.id
                };

                service.updateSchool(school)
                    .then((_) => res.render('editSucess'))
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: 500 })
                });
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