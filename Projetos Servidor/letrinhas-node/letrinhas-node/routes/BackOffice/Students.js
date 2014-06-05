﻿var service = require('../../Scripts/services/studentService');
var schoolService = require('../../Scripts/services/schoolService');

function mapRoutes(app) {
    app.get('/BackOffice/Students/All', function (req, res) {
        // objecto de opções.
        var options = Object.create(null);

        // Verificar se temos um id de escola válido. Ignoramo-lo se não for
        if (!isNaN(req.query.schoolId) || !isNaN(req.query.classId)) {
            options.schoolId = parseInt(req.query.schoolId, 10);
            options.classId = parseInt(req.query.classId, 10);
        }

        console.log(options.schoolId);
        console.log(options.classId);

        if (isNaN(options.classId)) {
            // Obtemos os alunos (opcionalmente para uma escola)...
            service.studentDetails(options.schoolId).then(function (studentData) {
                res.render('studentList', {
                    title: 'Lista de alunos' + (typeof options.schoolId !== 'undefined' ? ' da escola ' + studentData[0].schoolName : ''),
                    items: studentData
                });
            }).catch(function (err) {
                console.error(err);

                // TODO: Uma view de 500.
                res.render('listError');
            });
        } else {
            // Obtemos os alunos de uma turma (opcionalmente para uma escola)...
            service.studentDetailsEdit(options.schoolId, options.classId).then(function (studentData) {
                res.render('studentList', {
                    title: 'Lista de alunos' + (typeof options.schoolId !== 'undefined' ? ' da escola ' + studentData[0].schoolName : ''),
                    items: studentData
                });
            }).catch(function (err) {
                console.error(err);

                // TODO: Uma view de 500.
                res.render('listError');
            });
        }
    });

    app.all('/BackOffice/Students/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                schoolService.allSchoolClasses().then(function (schools) {
                    res.render('addStudent', {
                        title: 'Adicionar aluno',
                        escolas: schools
                    });
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).json({ error: 500 });
                });
                break;
            case 'POST':
                // TODO: Meter dados na BD.
                var body = req.body;

                var aluno = {
                    classId: parseInt(body.schoolId),
                    name: body.txtName
                };

                service.create(aluno, req.files.photo.path).then(function (_) {
                    return res.end('Dados inseridos com sucesso!');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).json({ error: 500 });
                });
                break;
            default:
                res.status(404).json({ error: 404 });
        }
    });

    app.all('/BackOffice/Students/Edit', function (req, res) {
        switch (req.method) {
            case 'GET':
                break;
            case 'POST':
                break;
            default:
                break;
        }
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Students.js.map
