import express = require('express');

import pool = require('../../configs/mysql');
import Q = require('q');
import mysql = require('mysql');
import path = require('path');
import uuid = require('node-uuid');
import app = require('../../app');
import mv = require('mv');

var poolQuery = Q.nbind<any>(pool.query, pool);

import service = require('../../Scripts/services/professorService');
import Professor = require('../../Scripts/structures/schools/Professor');
import schoolService = require('../../Scripts/services/schoolService');

export function mapRoutes(app: express.Express) {

    app.get('/BackOffice/Professors/All', function (req, res) {
        // objecto de opções.
        var options = Object.create(null);

        // Verificar se temos um id de escola válido. Ignoramo-lo se não for
        if (!isNaN(req.query.schoolId)) {
            options.schoolId = parseInt(req.query.schoolId, 10);
        }

        // Obtemos as turmas (opcionalmente para uma turma)...
        service.professorDetails(options.schoolId)
            .then((professorData) => {
                res.render('professorList', {
                    title: 'Lista de Professores' + (typeof options.schoolId !== 'undefined' ? ' da escola ' + professorData[0].schoolName : ''),
                    items: professorData
                });
            })
            .catch((err) => {
                console.error(err);
                // TODO: Uma view de 500.
                res.render('listError');
            });
    });

    app.all('/BackOffice/Professors/Create', function (req, res) {

        switch (req.method) {
            case 'GET':

                var schoolList,
                    classList;

                var sqlClasses =
                    'select c.id, c.classLevel, c.className, c.schoolId, ' +
                    'c.classYear, s.schoolName ' +
                    'from Classes as c ' +
                    'join Schools as s on s.id = c.schoolId';

                var sqlSchools = 'select id, schoolName from Schools;';

                return poolQuery(sqlClasses)
                    .then((result) => classList = result[0])
                    .then((_) => poolQuery(sqlSchools))
                    .then((result) => schoolList = result[0])
                    .then((_) => {
                        return res.render('addTeacher', {
                            title: 'Adicionar Professor',
                            schoolList: schoolList,
                            classList: classList
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).render('Erros/500');
                    });
                

                //schoolService.all()
                //    .then((schools) => {
                //        res.render('addTeacher', {
                //            title: 'Adicionar Professor',
                //            escolas: schools
                //        });
                //    })
                //    .catch((err) => {
                //        console.error(err);
                //        res.status(500).json({ error: 500 });
                //    });
                //break;
            case 'POST':
                var body = req.body;
                var professor = <Professor> {
                    schoolId: body.schoolId,
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    classIds: properlyHandleMultipleIds(body.classIds)
                };

                console.log(professor);

                service.createProfessor(professor, req.files.photo.path)
                    .then((_) => res.end('Dados inseridos com sucesso!'))
                    .catch((err) => {
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

    app.all('/BackOffice/Professors/Edit/:id', function (req, res) {
        // TODO
        switch (req.method) {
            case 'GET':
                // objecto de opções.
                var options = Object.create(null);
                
                // Verificar se temos um id de professor válido.
                if (!isNaN(req.params.id)) {
                    options.professorId = parseInt(req.params.id, 10);
                } else {
                    return res.status(400).render('Erros/400');
                }

                var professorDetails: Professor;
                var schoolList, classList;

                var sqlProfessor = mysql.format('SELECT * FROM Professors WHERE id = ?', [options.professorId]);
                var sqlSchools = 'SELECT id, schoolName FROM Schools';
                var sqlClasses = 'SELECT c.id, c.classLevel, c.classYear, c.className, ' + 
                                 'if ((select count(*) from ProfessorClass as pc where pc.classId = c.id and pc.professorId = ?) > 0, 1, 0) as isInClass ' +
                                 'from Classes as c;';

                sqlClasses = mysql.format(sqlClasses, options.professorId);

                return poolQuery(sqlProfessor)
                .then((profResults) => {
                    professorDetails = profResults[0][0];
                    return poolQuery(sqlSchools);
                })
                .then((schoolResults) => {
                    schoolList = schoolResults[0];
                    return poolQuery(sqlClasses);
                })
                .then((classResults) => res.render('editTeacher', {
                    title: 'Editar professor ' + professorDetails.name,
                    data: professorDetails,
                    schoolList: schoolList,
                    classList: classResults[0]
                }))
                .catch((err) => {
                    console.error(err);
                    return res.status(500).render('Erros/500');
                });
       
                /*service.professorDetailsEdit(options.professorId)
                    .then((professorData) => {
                        professorDetails = professorData
                    })
                    .then((_) => schoolService.all())
                    .then((schoolData) => {
                        schoolList = schoolData
                    })
                    .then((_) => {
                        res.render('editTeacher', {
                            title: 'Modificar dados de um professor',
                            itemsProfessor: professorDetails,
                            itemsSchool: schoolList
                        });
                        console.log(professorDetails.length);
                    })
                    .catch((err) => {
                        console.error(err);
                        // TODO: Uma view de 500.
                        res.status(500).render('Erros/500');
                    });
                break;*/
            case 'POST':
                var body = req.body;
              
                var professor = <Professor> {
                    schoolId: body.schoolId,
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    id: body.id,
                    isActive: body.state_filter,
                    classIds: properlyHandleMultipleIds(body.classIds)
                };

                service.editProfessor(professor)
                    .then((_) => res.render('editSucess'))
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: 500 })
                });
                break;
        }
    });

}

/**
 * This function unravels the mess that is the id list
 * when more than 2 fields come.
 * 
 * For some reason, the parser, for values 1, 3 and 9, for example,
 * does: [[1, 3], 9].
 * 
 * This takes that array and linearizes it, like this: [1, 3, 9].
 * 
 * @author redroserade
 */
function properlyHandleMultipleIds(idList: any[], dst = <any[]>[]) {
    for (var i = 0; i < idList.length; i++) {
        if (isNaN(idList[i])) {
            // dst = dst.concat(properlyHandleMultipleIds(idList[i], dst));
            properlyHandleMultipleIds(idList[i], dst);
        } else if (dst.indexOf(idList[i]) === -1) {
            dst.push(idList[i]);
        }
    }

    // console.log(dst);

    return dst;
}