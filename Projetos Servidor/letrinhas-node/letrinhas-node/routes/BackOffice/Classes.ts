import express = require('express');

import classService = require('../../Scripts/services/classService');
import schoolService = require('../../Scripts/services/schoolService');
import Class = require('../../Scripts/structures/schools/Class');

export function mapRoutes(app: express.Express) {

    app.get('/BackOffice/Classes/All', function (req, res) {
        // objecto de opções.
        var options = Object.create(null);

        // Verificar se temos um id de escola válido. Ignoramo-lo se não for
        if (!isNaN(req.query.schoolId)) {
            options.schoolId = parseInt(req.query.schoolId, 10);
        }

        // Obtemos as turmas (opcionalmente para uma turma)...
        classService.classDetails(options.schoolId)
            .then((classData) => {
                res.render('classList', {
                    title: 'Lista de turmas' + (typeof options.schoolId !== 'undefined' ? ' da escola' + classData[0].schoolName : ''),
                    items: classData
                });
            })
            .catch((err) => {
                console.error(err);
                // TODO: Uma view de 500.
                res.status(500).render('Erros/500');
            });
    });

    app.get('/BackOffice/Classes/Details/:id', function (req, res) {

    });

    app.all('/BackOffice/Classes/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                return res.render('addClass');
            case 'POST':
                // TODO: Meter dados na BD.
                var body = req.body;
                var sClass = <Class> {
                    schoolId: body.schoolId,
                    classLevel: body.year_filter,
                    className: body.className,
                    classYear: body.classYear
                };

                classService.createClass(sClass)
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

    app.get('/BackOffice/Classes/Choose', function (req, res) {
        return res.render('classChoose');
    });
}