import express = require('express');

import service = require('../../Scripts/services/professorService');
import Professor = require('../../Scripts/structures/schools/Professor');
import schoolService = require('../../Scripts/services/schoolService');

export function mapRoutes(app: express.Express) {
    app.all('/BackOffice/Professors/Create', function (req, res) {

        switch (req.method) {
            case 'GET':
                return res.render('addTeacher');
            case 'POST':
                // TODO: Meter dados na BD.
                var body = req.body;
                var professor = <Professor> {
                    schoolId: parseInt(body.schoolId),
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    isActive: body.state_filter,
                };

                service.createProfessor(professor, req.files.photo.path)
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

    app.get('/BackOffice/Professors/Choose', function (req, res) {
        return res.render('professorChoose');
    });

    app.get('/Professors/bySchool', function (req, res) {
        schoolService.getId(function (err, result) {
            res.render('professorBySchool', {
                title: 'Letrinhas',
                items: result
            });
        });
    });

    app.get('/BackOffice/Professors/GetAll/:id?', function (req, res) {
        var id = parseInt(req.params.id, 10);
        switch (id) {
            case 1:
                service.getAllProfessors(function (err, result) {
                    res.render('professorList', {
                        title: 'Lista de professores do agrupamento',
                        items: result
                    });
                });
            case 2:
                service.getProfessorBySchoolId(req.query.professorSelect, function (err, result) {
                    res.render('professorList', {
                        title: 'Lista de Turmas da escola ' + result.schoolName,
                        items: result
                    });
                });

        }
    });

    app.all('/BackOffice/Professors/Edit/:id', function (req, res) {
        // TODO
        throw 'NYI';
    });
}