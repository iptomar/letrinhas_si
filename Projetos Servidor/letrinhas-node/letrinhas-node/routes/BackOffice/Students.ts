import express = require('express');

import service = require('../../Scripts/services/studentService');
import schoolService = require('../../Scripts/services/schoolService');
import Student = require('../../Scripts/structures/schools/Student');

export function mapRoutes(app) {

    app.get('/BackOffice/Students/All', function (req, res) {
        // objecto de opções.
        var options = Object.create(null);

        // Verificar se temos um id de escola válido. Ignoramo-lo se não for
        if (!isNaN(req.query.schoolId) || !isNaN(req.query.classId)) {
            options.schoolId = parseInt(req.query.schoolId, 10);
            options.classId = parseInt(req.query.classId, 10);
        }

        service.studentDetails(
            isNaN(options.schoolId) ? undefined : options.schoolId,
            isNaN(options.classId) ? undefined : options.classId)
        .then((studentData) => {
                    res.render('studentList', {
                        title: 'Lista de alunos',
                        items: studentData
                    });
                })
                .catch((err) => {
                    console.error(err);
                    // TODO: Uma view de 500.
                    res.status(500).render('Erros/500');
                });
    });


    app.all('/BackOffice/Students/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                schoolService.allSchoolClasses()
                    .then((schools) => {
                        res.render('addStudent', {
                            title: 'Adicionar aluno',
                            escolas: schools
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: 500 });
                    });
                break;
            case 'POST':

                // TODO: Meter dados na BD.
                var body = req.body;

                var aluno = <Student> {
                    classId: parseInt(body.schoolId),
                    name: body.txtName
                };

                service.create(aluno, req.files.photo.path)
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

    app.all('/BackOffice/Students/Edit', function (req, res) {
          // TODO      
        switch (req.method) {
            case 'GET':
                // objecto de opções.
                var options = Object.create(null);
                
                // Verificar se temos um id de escola válido. Ignoramo-lo se não for
                if (!isNaN(req.query.studentId)) {
                    options.studentId = parseInt(req.query.studentId, 10);
                }
                var studentDetails;
                var classDetails;

                service.studentDetailsChangeClass(options.studentId)
                    .then((studentData) => studentDetails = studentData)
                    .then((_) => schoolService.allSchoolClasses())
                    .then((classData) => classDetails = classData)
                    .then((_) => {
                        res.render('changeStudentClass', {
                            title: 'Alterar dados do estudante',
                            studentDetails: studentDetails,
                            itemsClass : classDetails
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).render('Erros/500');
                    });
                break;
            case 'POST':
                var body = req.body;
                var aluno = <Student> {
                    id: parseInt(body.id),
                    classId: parseInt(body.newClass),
                    name: body.name
                };
                service.editStudentClass(aluno)
                    .then((_) => res.render('editSucess'))
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: 500 })
                });
                break;
            default:
                break;
        }
    });
}