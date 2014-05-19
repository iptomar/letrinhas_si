import express = require('express');

import service = require('../Scripts/services/schoolService');
import School = require('../Scripts/structures/schools/School');

export function mapRoutes(app: express.Express) {
    app.all('/Students/Create', function (req, res) {
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

                return service.createSchool(school, req.files.photo.path)
                    .then((_) => res.end('Dados inseridos com sucesso!'))
                    .catch((err) => res.end('error: ' + err.toString()));
            default:
                return res.status(404).json({ error: 404 });
        }
    });
}