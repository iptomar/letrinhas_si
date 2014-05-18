/// <reference path="../app.ts" />
/// <reference path="../Scripts/typings/express/express.d.ts" />

import indexActions = require('../routes/index');
import testActions = require('../routes/tests');
import syncActions = require('../routes/sync');
import Classes = require('../routes/Classes');
import TestService = require('../routes/Tests2');
import express = require('express');

/**
 * Maps routes to the server.
 * 
 * @param app The server which routes will be mapped to.
 */
export function mapRoutes(app: express.Express) {
    mapGetRoutes(app);
    mapPostRoutes(app);
    mapSyncRoutes(app);

    mapClassRoutes(app);

    // Probably unnecessary.
    // app.use(sendNotFound);
}

function mapGetRoutes(app: express.Express) {
    app.get('/', indexActions.index);
    // app.get('/users', user.list);
    app.get('/testSummary', testActions.listSummary);

    app.get('/image', testActions.getImage);

    // app.get('/getTest', testActions.getTest);

    app.all('/CreateTest', testActions.createTest);

    app.all('/CreateTeacher', testActions.createTeacher);

    app.all('/CreateAluno', testActions.createAluno);

    app.all('/CreateClass', testActions.createClass);

    app.all('/CreateSchool', testActions.createSchool);

    app.get('/tests/:id?', testActions.getTest);

    app.get('/testsSince', testActions.testsSince);



    //chama a nova rota para testes random. Forma da QueryString /getRandomTest?
    app.get('/tests/random', testActions.getRandomTest);

    console.log("Successfully mapped GET routes.");
}

function mapClassRoutes(app: express.Express) {
    app.get('/Classes/', Classes.all);
    app.get('/Class/:id', Classes.details);
    app.get('/Class/:id/Students', Classes.students);
    app.get('/Classes/Create/', Classes.create);
    app.get('/Classes/Relationships', Classes.classRelationships);
}

function mapPostRoutes(app: express.Express) {
    app.post('/postTestResults', testActions.postTestResults);
    app.post('/postFiles', testActions.postImage);

    console.log('Successfully mapped POST routes.');
}

function mapSyncRoutes(app: express.Express) {
    // Sync routes.
    app.get('/professors', syncActions.getProfessors);
    app.get('/schools', syncActions.getSchools);
    app.get('/students', syncActions.getStudents);
    // app.get('/classes', syncActions.getClasses);
    app.get('/professorClasses', syncActions.getProfessorClasses);

    // app.post('/Tests/Create', testActions.createTest);

    console.log('Successfully mapped GET and POST routes for sync.');
}

function mapTestsRoutes(app: express.Express) {

    // GET: /Tests/All/
    // Params: 
    // -ofType=[0, 1, 2, 3]
    // -areaId
    // -grade
    // -professorId
    // -creationDate
    app.get('/Tests/All', function (req: express.Request, res: express.Response) {
        var type = parseInt(req.params.type),
            options = Object.create(null),
            areaId = parseInt(req.params.areaId),
            grade = parseInt(req.params.grade),
            professorId = parseInt(req.params.professorId),
            creationDate = parseInt(req.params.creationDate);

        if (isNaN(type)) { return res.status(400).json({ error: 400 }); }

        if (!isNaN(areaId)) { options.areaId = areaId; }
        if (!isNaN(grade)) { options.grade = grade; }
        if (!isNaN(professorId)) { options.professorId = professorId; }
        if (!isNaN(creationDate)) { options.creationDate = creationDate; }

        TestService.all(type, options)
            .then((tests) => res.json(tests))
            .catch((_) => res.status(500).end({ error: 500 }));
    });

    app.get('/Tests/Details/:id', function (req: express.Request, res: express.Response) {
        var id = parseInt(req.params.id);

        if (isNaN(id)) { return res.status(400).json({ error: 400 }); }

        TestService.details(id)
            .then((test) => {
                if (test === null) { return res.status(404).json({ error: 404 }) }

                return res.json(test);
            })
            .catch((err) => res.status(500).json({ error: 500 }));
    });
}