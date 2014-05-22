import express = require('express');

import service = require('../Scripts/services/testService');

import testService = require('../Scripts/services/testService');

import TestType = require('../Scripts/structures/tests/TestType');

import Test = require('../Scripts/structures/tests/Test');
import ReadingTest = require('../Scripts/structures/tests/ReadingTest');
import MultimediaTest = require('../Scripts/structures/tests/MultimediaTest');

import ReadingTestCorrection = require('../Scripts/structures/tests/ReadingTestCorrection');
import MultimediaTestCorrection = require('../Scripts/structures/tests/MultimediaTestCorrection');

export function mapRoutes(app: express.Express) {
    // GET + POST: /Tests/Create/Read
    app.all('/Tests/Create/Read', function (req, res) {
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

                service.createReadTest(teste, req.files.audio.path)
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



    app.all('/Tests/Create/Multimedia', function (req, res) {
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

   
    // GET: /Tests/All/
    // Params: 
    // -ofType=[0, 1, 2, 3]
    // -areaId
    // -grade
    // -professorId
    // -creationDate
    app.get('/Tests/All', function (req, res) {
        var type = parseInt(req.query.type),
            options = Object.create(null),
            areaId = parseInt(req.query.areaId),
            grade = parseInt(req.query.grade),
            professorId = parseInt(req.query.professorId),
            creationDate = parseInt(req.query.creationDate);

        if (isNaN(type)) { return res.status(400).json({ error: 400 }); }

        if (!isNaN(areaId)) { options.areaId = areaId; }
        if (!isNaN(grade)) { options.grade = grade; }
        if (!isNaN(professorId)) { options.professorId = professorId; }
        if (!isNaN(creationDate)) { options.creationDate = creationDate; }

        service.all(type, options)
            .then((tests) => res.json(tests))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    /**
     * GET /Tests/Random
     * 
     * Params:
     * areaId: number
     * grade: number
     * count: number (optional)
     * 
     * @author luisfmoliveira
     */
    app.get('/Tests/Random', function (req, res) {
        var num = parseInt(req.query.count),
            year = parseInt(req.query.grade),
            area = parseInt(req.query.areaId),
            options = Object.create(null);

        if (isNaN(area) || isNaN(year)) { return res.status(400).json({ error: 400 }); }

        if (!isNaN(num)) { options.num = num; }
        if (!isNaN(area)) { options.area = area; }
        if (!isNaN(year)) { options.year = year; }

        service.random(options)
            .then((tests) => res.json(tests))
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    // GET: /Tests/Details/5
    app.get('/Tests/Details/:id', function (req, res) {
        var id = parseInt(req.params.id);

        if (isNaN(id)) { return res.status(400).json({ error: 400 }); }

        service.details(id)
            .then((test) => {
                if (test === null) { return res.status(404).json({ error: 404 }) }

                return res.json(test);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: 500 })
            });
    });

    app.post('/Tests/Submit/', function (req, res) {
        var type = !isNaN(req.body.type) ? parseInt(req.body.type, 10) : null;

        if (!isNaN(type)) {
            switch (type) {
                case TestType.read:
                case TestType.list:
                case TestType.poem:
                    var body = req.body;

                    var rtc = <ReadingTestCorrection> {
                        testId: !isNaN(body.testId) ? parseInt(body.testId, 10) : null,
                        studentId: !isNaN(body.studentId) ? parseInt(body.studentId, 10) : null,
                        executionDate: !isNaN(body.executionDate) ? parseInt(body.executionDate, 10) : null,
                        type:  type,

                        correctWordCount: !isNaN(body.correct) ? parseInt(body.correct, 10) : null,
                        readingPrecision: !isNaN(body.precision) ? parseFloat(body.precision) : null,
                        expressiveness: !isNaN(body.expressiveness) ? parseFloat(body.expressiveness) : null,
                        rhythm: !isNaN(body.rhythm) ? parseFloat(body.rhythm) : null,
                        readingSpeed: !isNaN(body.speed) ? parseFloat(body.speed) : null,
                        wordsPerMinute: !isNaN(body.wpm) ? parseFloat(body.wpm) : null,

                        professorObservations: body.observations,
                        details: body.details,

                        wasCorrected: !isNaN(body.wasCorrected) ? parseInt(body.wasCorrected, 10) : null
                    };

                    service.submitResult(rtc, req.files.audio.path)
                        .then((_) => res.json(null))
                        .catch((err) => {
                            console.error(err);
                            res.status(500).json({ error: 500 });
                        });

                    break;
                case TestType.multimedia:

                    var mtc = <MultimediaTestCorrection> {
                        testId: !isNaN(body.testId) ? parseInt(body.testId, 10) : null,
                        studentId: !isNaN(body.studentId) ? parseInt(body.studentId, 10) : null,
                        executionDate: !isNaN(body.executionDate) ? parseInt(body.executionDate, 10) : null,
                        type: type,
                        isCorrect: !isNaN(body.isCorrect) ? parseInt(body.isCorrect, 10) : null,
                        optionChosen: !isNaN(body.optionChosen) ? parseInt(body.optionChosen, 10) : null
                    };

                    service.submitResult(mtc)
                        .then((_) => res.json(null))
                        .catch((err) => {
                            console.error(err);
                            res.status(500).json({ error: 500 });
                        });

                    break;
                default:
                    res.status(404).json({ error: 404 });
            }
        } else {
            res.status(400).json({ error: 400 });
        }
    });
}
