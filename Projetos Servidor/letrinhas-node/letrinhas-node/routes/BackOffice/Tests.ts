import express = require('express');

import testService = require('../../Scripts/services/testService');

import TestType = require('../../Scripts/structures/tests/TestType');

import Test = require('../../Scripts/structures/tests/Test');
import ReadingTest = require('../../Scripts/structures/tests/ReadingTest');
import MultimediaTest = require('../../Scripts/structures/tests/MultimediaTest');

import ReadingTestCorrection = require('../../Scripts/structures/tests/ReadingTestCorrection');
import MultimediaTestCorrection = require('../../Scripts/structures/tests/MultimediaTestCorrection');

export function mapRoutes(app) {
    app.all('/BackOffice/Tests/Create/Multimedia', function (req, res) {
        // TODO

        switch (req.method) {
            case 'GET':
                res.render('addMultimediaTest');
                break;
            case 'POST':
                var body = req.body;

                var teste = <MultimediaTest> {
                    professorId: req.body.id_professor,
                    option1: req.body.opt1,
                    option2: req.body.opt2,
                    option3: req.body.opt3,
                    areaId: req.body.areaId,
                    mainText: req.body.maintext,
                    type: req.body.type,
                };

                testService.saveMultimediaTest(teste)
                    .then((_) => res.end('Sucesso!!')) 
                    .catch((erro) => {
                        console.log(erro); 
                        res.status(500).json({ error: 500 })
                    });
  

                console.log(req.body);

                break;
            default:
                // TODO: Talvez fazer uma view para 404, 500, etc.?
                res.status(404).json({ error: 404 });
        }
    });


    // GET + POST: /Tests/Create/Read
    app.all('/BackOffice/Tests/Create/Read', function (req, res) {
        switch (req.method) {
            case 'GET':
                res.render('addReadingTest');
                break;
            case 'POST':
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

        switch (req.method) {
            case 'GET':
                res.render('addMultimediaTest');
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
}