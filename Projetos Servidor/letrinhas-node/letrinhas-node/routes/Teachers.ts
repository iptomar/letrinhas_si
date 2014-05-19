import express = require('express');

import service = require('../Scripts/services/teacherService');
import Teacher = require('../Scripts/structures/schools/School');

export function mapRoutes(app: express.Express) {
    app.all('/Teachers/Create', function (req, res) {

        switch (req.method) {
            case 'GET':
                return res.render('addTeacher');
            case 'POST':
                // TODO: Meter dados na BD.
                var body = req.body;
                var teacher = <Teacher> {
                    schoolId: parseInt(body.schoolId),
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    isActive: body.state_filter,
                };

                appPostServices.addTeacher(teacher, req.files.photo.path, req.files.photo.originalname)
                    .then((_) => res.end('Dados inseridos com sucesso!'))
                    .catch((err) => res.end('error: ' + err.toString()));

        }
    }
}