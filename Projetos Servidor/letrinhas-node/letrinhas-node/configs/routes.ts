import indexActions = require('../routes/index');
//import syncActions = require('../routes/sync');

import studentRoutes = require('../routes/Students');
import classRoutes = require('../routes/Classes');
import testRoutes = require('../routes/Tests');
import professorRoutes = require('../routes/Professors');
import schoolRoutes = require('../routes/Schools');

import express = require('express');

/**
 * Maps routes to the server.
 * 
 * @param app The server which routes will be mapped to.
 */
export function mapRoutes(app: express.Express) {
    app.get('/', indexActions.index);


    //mapGetRoutes(app);
    //mapPostRoutes(app);
    //mapSyncRoutes(app);

    //mapClassRoutes(app);

    // /Students
    studentRoutes.mapRoutes(app);

    // /Classes
    classRoutes.mapRoutes(app);

    // /Tests
    testRoutes.mapRoutes(app);

    // /Professors
    professorRoutes.mapRoutes(app);

    // /Schools
    schoolRoutes.mapRoutes(app);

    // Probably unnecessary.
    // app.use(sendNotFound);
}

//function mapGetRoutes(app: express.Express) {
//    app.get('/', indexActions.index);
//    // app.get('/users', user.list);
//    //app.get('/testSummary', testActions.listSummary);

//    //app.get('/image', testActions.getImage);

//    // app.get('/getTest', testActions.getTest);

//    // app.all('/CreateTest', testActions.createTest);

//    //app.all('/CreateTeacher', testActions.createTeacher);

//    //app.all('/CreateAluno', testActions.createAluno);

//    //app.all('/CreateClass', testActions.createClass);

//    //app.all('/CreateSchool', testActions.createSchool);

//    //app.get('/tests/:id?', testActions.getTest);

//    //app.get('/testsSince', testActions.testsSince);



//    //chama a nova rota para testes random. Forma da QueryString /getRandomTest?
//    //app.get('/tests/random', testActions.getRandomTest);

//    console.log("Successfully mapped GET routes.");
//}

//function mapClassRoutes(app: express.Express) {
//    app.get('/Classes/', Classes.all);
//    app.get('/Class/:id', Classes.details);
//    app.get('/Class/:id/Students', Classes.students);
//    app.get('/Classes/Create/', Classes.create);
//    app.get('/Classes/Relationships', Classes.classRelationships);
//}

//function mapPostRoutes(app: express.Express) {
//    //app.post('/postTestResults', testActions.postTestResults);
//    //app.post('/postFiles', testActions.postImage);

//    console.log('Successfully mapped POST routes.');
//}

//function mapSyncRoutes(app: express.Express) {
//    // Sync routes.
//    app.get('/professors', syncActions.getProfessors);
//    app.get('/schools', syncActions.getSchools);
//    app.get('/students', syncActions.getStudents);
//    // app.get('/classes', syncActions.getClasses);
//    app.get('/professorClasses', syncActions.getProfessorClasses);

//    // app.post('/Tests/Create', testActions.createTest);

//    console.log('Successfully mapped GET and POST routes for sync.');
//}