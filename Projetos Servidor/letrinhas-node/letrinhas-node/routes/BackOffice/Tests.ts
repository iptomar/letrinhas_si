import express = require('express');

import testService = require('../../Scripts/services/testService');
import professorService = require('../../Scripts/services/professorService');

import TestType = require('../../Scripts/structures/tests/TestType');

import Test = require('../../Scripts/structures/tests/Test');
import ReadingTest = require('../../Scripts/structures/tests/ReadingTest');
import MultimediaTest = require('../../Scripts/structures/tests/MultimediaTest');

import ReadingTestCorrection = require('../../Scripts/structures/tests/ReadingTestCorrection');
import MultimediaTestCorrection = require('../../Scripts/structures/tests/MultimediaTestCorrection');
import TestCorrection = require('../../Scripts/structures/tests/TestCorrection');

export function mapRoutes(app: express.Express) {
    // GET + POST: /Tests/Create/Read
    app.all('/BackOffice/Tests/Create/Read', function (req, res) {
        switch (req.method) {
            case 'GET':
                professorService.all()
                    .then((professors) => {
                        res.render('addReadingTest', {
                            title: 'Adicionar teste de leitura',
                            professores: professors
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: 500 });
                    });


                break;
            case 'POST':

                if (typeof req.files.audio === 'undefined') {
                    return res.status(400).json({ error: 400 });
                }

                var body = req.body;

                var teste = <ReadingTest> {
                    title: body.title,
                    grade: body.grade,
                    creationDate: Date.now(),
                    professorId: body.professorId,
                    areaId: body.areaId,
                    mainText: body.mainText,
                    textContent: body.textContent,
                    type: body.type,
                };

                console.log(teste);

                testService.createReadTest(teste, req.files.audio.path)
                // TODO: Talvez fazer redirect para a lista.
                    .then((_) => res.redirect('/'))
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: 500 })
                });
                break;
            default:
                // TODO: Talvez fazer uma view para 404, 500, etc.?
                res.status(404).json({ error: 404 });
        }
    });

    app.all('/BackOffice/Tests/Create/Multimedia', function (req, res) {
        // TODO

        console.log(req);

        switch (req.method) {
            case 'GET':
                switch (req.query.type) {
                    case '0':
                        res.render('addMultimediaTest');
                        break;
                    case '1':
                        // Texto e imagens
                        res.end('NYI');
                        break;
                    case '2':
                        // Só Imagens
                        res.end('NYI');
                        break;
                    default:
                        res.render('multimediaTipoEscolhe');
                        // Perguntar pelo tipo de teste
                        break;
                }

                break;
            case 'POST':
                var body = req.body;

                var teste = <MultimediaTest> {
                    title: body.title,
                    professorId: body.professorId,
                    areaId: body.areaId,
                    mainText: body.mainText,
                    type: body.type,
                };

                console.log(teste);

                break;
            default:
                // TODO: Talvez fazer uma view para 404, 500, etc.?
                res.status(404).json({ error: 404 });
        }
    });

    app.get('/BackOffice/Tests/Submissions', function (req, res) {
        var isCorrected = parseInt(req.query.isCorrected);

        if (isNaN(isCorrected)) {
            return res.status(400).render('Erros/400');
        }


        testService.submissions(isCorrected)
        //.then(submissions => res.json(submissions))
            .then(function (submissions) {
                res.render('submissionsList', { title: "Submissoes", items: submissions });
            })
                .catch((err) => {
                console.error(err);
                res.status(500).render('Erros/500');
            });
    });
}
