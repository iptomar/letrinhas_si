﻿var pool = require('../../configs/mysql');
var Q = require('q');

var poolQuery = Q.nbind(pool.query, pool);

var service = require('../../Scripts/services/professorService');

var schoolService = require('../../Scripts/services/schoolService');

function mapRoutes(app) {
    app.get('/BackOffice/Professors/All', function (req, res) {
        // objecto de opções.
        var options = Object.create(null);

        // Verificar se temos um id de escola válido. Ignoramo-lo se não for
        if (!isNaN(req.query.schoolId)) {
            options.schoolId = parseInt(req.query.schoolId, 10);
        }

        // Obtemos as turmas (opcionalmente para uma turma)...
        service.professorDetails(options.schoolId).then(function (professorData) {
            res.render('professorList', {
                title: 'Lista de Professores' + (typeof options.schoolId !== 'undefined' ? ' da escola ' + professorData[0].schoolName : ''),
                items: professorData
            });
        }).catch(function (err) {
            console.error(err);

            // TODO: Uma view de 500.
            res.render('listError');
        });
    });

    app.all('/BackOffice/Professors/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                var schoolList, classList;

                var sqlClasses = 'select c.id, c.classLevel, c.className, c.schoolId, ' + 'c.classYear, s.schoolName ' + 'from Classes as c ' + 'join Schools as s on s.id = c.schoolId';

                var sqlSchools = 'select id, schoolName from Schools;';

                return poolQuery(sqlClasses).then(function (result) {
                    return classList = result[0];
                }).then(function (_) {
                    return poolQuery(sqlSchools);
                }).then(function (result) {
                    return schoolList = result[0];
                }).then(function (_) {
                    return res.render('addTeacher', {
                        title: 'Adicionar Professor',
                        schoolList: schoolList,
                        classList: classList
                    });
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).render('Erros/500');
                });

            case 'POST':
                var body = req.body;
                var professor = {
                    schoolId: body.schoolId,
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    classIds: body.classIds
                };

                console.log(body);

                service.createProfessor(professor, req.files.photo.path).then(function (_) {
                    return res.end('Dados inseridos com sucesso!');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).render('Erros/500');
                });
                break;
            default:
                res.status(404).render('Erros/404');
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

    app.all('/BackOffice/Professors/Edit', function (req, res) {
        switch (req.method) {
            case 'GET':
                // objecto de opções.
                var options = Object.create(null);

                // Verificar se temos um id de professor válido. Ignoramo-lo se não for
                if (!isNaN(req.query.professorId)) {
                    options.professorId = parseInt(req.query.professorId, 10);
                }
                var professorDetails;
                var schoolDetails;

                service.professorDetailsEdit(options.professorId).then(function (professorData) {
                    professorDetails = professorData;
                }).then(function (_) {
                    return schoolService.all();
                }).then(function (schoolData) {
                    schoolDetails = schoolData;
                }).then(function (_) {
                    res.render('editTeacher', {
                        title: 'Modificar dados de um professor',
                        itemsProfessor: professorDetails,
                        itemsSchool: schoolDetails
                    });
                    console.log(professorDetails.lenght);
                }).catch(function (err) {
                    console.error(err);

                    // TODO: Uma view de 500.
                    res.status(500).render('Erros/500');
                });
                break;
            case 'POST':
                var body = req.body;

                var professor = {
                    schoolId: body.schoolId,
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    id: body.id,
                    isActive: body.state_filter
                };
                ;
                service.editProfessor(professor).then(function (_) {
                    return res.render('editSucess');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).json({ error: 500 });
                });
                break;
        }
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Professors.js.map
