/// <reference path="../Scripts/typings/express/express.d.ts" />
/// <reference path="../Scripts/typings/node/node.d.ts" />
//import express = require('express');
//import fs = require('fs');
//import Q = require('q');
//import path = require('path');
//import appPostServices = require('../Scripts/services/appPostServices');
//import appGetServices = require('../Scripts/services/appGetServices');
//import TestType = require('../Scripts/structures/tests/TestType');
//import TestCorrection = require('../Scripts/structures/tests/TestCorrection');
//import ReadingTestCorrection = require('../Scripts/structures/tests/ReadingTestCorrection');
//import MultimediaTestCorrection = require('../Scripts/structures/tests/MultimediaTestCorrection');
//import Teacher = require('../Scripts/structures/schools/Professor');
//import Aluno = require('../Scripts/structures/schools/Student');
//import ReadingTest = require('../Scripts/structures/tests/ReadingTest');
//import SchoolClass = require('../Scripts/structures/schools/Class');
//import School = require('../Scripts/structures/schools/School');
//export function listSummary(request: express.Request, response: express.Response): void {
//    var max = parseInt(request.param('max'));
//    max = isNaN(max) ? null : max;
//    appGetServices.getTestListSummaryFromDb(max, (err, list) => {
//        response.set('Content-Type', 'application/json');
//        response.charset = 'utf-8';
//        if (err) {
//            response.statusCode = 500;
//            response.send(JSON.stringify({
//                success: 0,
//                reason: err.message
//            }));
//        } else {
//            response.send(JSON.stringify({
//                tests: list,
//                success: 1
//            }));
//        }
//    });
//}
//export function getImage(request: express.Request, response: express.Response) {
//    //appGetServices.getBinaryData((err, result) => {
//    //response.type('json');
//    //response.end(JSON.stringify({
//    //    id: 1,
//    //    title: 'Um carrinho bonito',
//    //    image: result.toString('base64'),
//    //    success: 1
//    //}));
//    response.end('');
//    //});
//    //console.log("Hello");
//}
//export function postImage(request: express.Request, response: express.Response) {
//    // console.log(request);
//    var correctId: string = request.body['correct-id'];
//    //// Read the file
//    //fs.readFile(request.files[correctId].path, (err, data) => {
//    //    appPostServices.sendBinaryDataToDb(data, (err) => {
//    //        if (err) {
//    //            console.log(err);
//    //        }
//    //        response.end('Whatever');
//    //    });
//    //});
//    // console.log(request.body);
//    //fs.readFile(request.files[correctId].path, (err, data) => {
//    //    fs.writeFile('D:/' + request.files[correctId].path, data, (err) => {
//    //        console.log('Saved file.');
//    //    });
//    //});
//    console.log(correctId);
//    console.log(request.files);
//    response.end('Whatever');
//}
//export function teste(request: express.Request, response: express.Response) {
//    console.log(request.url);
//    response.render('teste', {
//        title: "Isto é um teste",
//        pessoa: "André Carvalho"
//    });
//}
//export function getTest(request: express.Request, response: express.Response) {
//    var type: number;
//    if (request.params.id && !isNaN(parseInt(request.params.id, 10))) {
//        // Get one, using its Id.
//        appGetServices.getTestById(request.params.id)
//            .then((test) => response.status(test === null ? 404 : 200).json(test))
//            .catch((err) => {
//                console.log(err.stack);
//                response.status(500).json(null);
//            });
//    } else if (!isNaN(type = parseInt(request.query.type))) {
//        // Get all of a specific type. The type is needed,
//        // but area and grade are optional.
//        var areaId = parseInt(request.query.areaId, 10),
//            grade = parseInt(request.query.grade, 10),
//            professorId = parseInt(request.query.professorId, 10),
//            creationDate = parseInt(request.query.since, 10);
//        appGetServices.getTests({
//            type: type,
//            areaId: isNaN(areaId) ? undefined : areaId,
//            grade: isNaN(grade) ? undefined : grade,
//            professorId: isNaN(professorId) ? undefined : professorId,
//            creationDate: isNaN(creationDate) ? undefined : creationDate
//        })
//            .then((tests) => response.json(tests))
//            .catch((err) => {
//                console.log(err);
//                response.status(500).json(null);
//            });
//    } else {
//        response.status(400).json({});
//    }
//}
//função que devolve um teste com perguntas random
//export function getRandomTest(request: express.Request, response: express.Response) {
//    //em querystring vem o numero de perguntas que se pretende, o ano e a area
//    var num: number = request.query['num'];
//    var year: number = request.query['ano'];
//    var area: string = request.query['area'];
//    if (isNaN(num) || isNaN(year)) {
//        response.end("Number or Year invalid.");
//    }
//    else {
//        appGetServices.getAllRandomTests(num, year, area, (err, testlist) => {
//            var sendResult = {
//                tests: testlist,
//                success: 1
//            };
//            response.end(JSON.stringify(sendResult));
//        });
//    }
//}
//export function testsSince(request: express.Request, response: express.Response) {
//    var time: number;
//    if (request.query.hasOwnProperty('since') && !isNaN(time = parseInt(request.query.since, 10))) {
//        appGetServices.getTestsNewerThan(time)
//            .then((tests) => {
//                response.json(tests);
//            });
//    } else {
//        response.status(400).type('json').end('null');
//    }
//}
//export function postTestResults(request: express.Request, response: express.Response) {
//    // Fields:
//    // * executionDate: The unix timestamp on which the test was done.
//    // * testId: The ID of the test. Integer, higher than 0.
//    // * studentId: The ID of the student. Integer, higher than 0.
//    // * type: String Enum, values: read, multimedia (? Could get the type from the DB)
//    // * (If type is multimedia)
//    //   * option: The option which was chosen.Integer, values = 1, 2, or 3.
//    // * (If type is read):
//    //   * observations: Professor observations. String.
//    //   * wpm: Words per minute. Number.
//    //   * correct: Correct word count: Integer.
//    //   * precision: Reading precision. Number.
//    //   * speed: Reading speed. Number.
//    //   * expressiveness: The student's expressiveness. Number.
//    //   * rhythm: The student's rhythm. Number.
//    //   * incorrect: Incorrect word count. Integer.
//    //   * audio: The audio for the recording. File.
//    var type = parseInt(request.body.type, 10);
//    if (!isNaN(type)) {
//        switch (type) {
//            case TestType.read:
//                var body = request.body;
//                var correction = <ReadingTestCorrection> {
//                    testId: parseInt(body.testId, 10),
//                    studentId: parseInt(body.studentId, 10),
//                    executionDate: parseInt(body.executionDate, 10),
//                    type: TestType.read,
//                    correctWordCount: parseInt(body.correct, 10),
//                    readingPrecision: parseFloat(body.precision),
//                    expressiveness: parseFloat(body.expressiveness),
//                    rhythm: parseFloat(body.rhythm),
//                    readingSpeed: parseFloat(body.speed),
//                    wordsPerMinute: parseFloat(body.wpm),
//                    professorObservations: body.observations,
//                    details: body.details
//                };
//                appPostServices.saveTestCorrection(correction, request.files.audio.path, request.files.audio.originalname)
//                    .then((_) => response.json(null))
//                    .catch((err) => {
//                        console.error(err);
//                        response.status(500).json(null);
//                    });
//                break;
//            case TestType.multimedia:
//                response.status(500).end('NYI');
//                break;
//            default:
//                response.status(400).json(null);
//        }
//    } else {
//        response.status(400).json(null);
//    }
//}
//export function createTest(req: express.Request, res: express.Response) {
//    switch (req.method) {
//        case 'GET':
//            return res.render('addReadingTest');
//        case 'POST':
//            // TODO: Meter dados na BD.
//            var body = req.body;
//            var teste = <ReadingTest> {
//                title: body.title,
//                grade: body.grade,
//                creationDate: Date.now(),
//                professorId: body.professorId,
//                areaId: body.areaId,
//                mainText: body.mainText,
//                textContent: body.textContent,
//                type: body.type,
//            };
//            appPostServices.addReadingTest(teste, req.files.audio.path, req.files.audio.originalname)
//                .then((_) => res.end('Dados inseridos com sucesso!'))
//                .catch((err) => res.end('error: ' + err.toString()));
//            //return ;
//    }
//}
//export function createTeacher(req: express.Request, res: express.Response) {
//    switch (req.method) {
//        case 'GET':
//            return res.render('addTeacher');
//        case 'POST':
//            // TODO: Meter dados na BD.
//            var body = req.body;
//            var teacher = <Teacher> {
//                schoolId: parseInt(body.schoolId),
//                name: body.name,
//                username: body.username,
//                password: body.password,
//                emailAddress: body.mail,
//                telephoneNumber: body.phone,
//                isActive: body.state_filter,
//            };
//            appPostServices.addTeacher(teacher, req.files.photo.path, req.files.photo.originalname)
//                .then((_) => res.end('Dados inseridos com sucesso!'))
//                .catch((err) => res.end('error: ' + err.toString()));
//    }
//}
//export function createAluno(req: express.Request, res: express.Response) {
//    switch (req.method) {
//        case 'GET':
//            return res.render('addStudent');
//        case 'POST':
//            // TODO: Meter dados na BD.
//            var body = req.body;
//            var aluno = <Aluno> {
//                classId: parseInt(body.txtIdEscola),
//                name: body.txtName,
//                isActive: body.state_filter,
//            };
//            appPostServices.addStudent(aluno, req.files.photo.path, req.files.photo.originalname)
//                .then((_) => res.end('Dados inseridos com sucesso!'))
//                .catch((err) => res.end('error: ' + err.toString()));
//    }
//}
//export function createClass(req: express.Request, res: express.Response) {
//    switch (req.method) {
//        case 'GET':
//            return res.render('addClass');
//        case 'POST':
//            // TODO: Meter dados na BD.
//            var body = req.body;
//            var sClass = <SchoolClass> {
//                schoolId: body.schoolId,
//                classLevel: body.year_filter,
//                className: body.className,
//                classYear: body.classYear
//            };
//            appPostServices.addClass(sClass);
//            res.end('Dados inseridos com sucesso!');
//        //.catch((err) => res.end('error: ' + err.toString()));
//    }
//}
//export function createSchool(req: express.Request, res: express.Response) {
//    switch (req.method) {
//        case 'GET':
//            return res.render('addSchool');
//        case 'POST':
//            // TODO: Meter dados na BD.
//            var body = req.body;
//            var school = <School> {
//                schoolName: body.schoolName,
//                schoolAddress: body.schoolAddress,
//                schoolLogoUrl: body.photo
//            };
//            appPostServices.addSchool(school, req.files.photo.path, req.files.photo.originalname)
//                .then((_) => res.end('Dados inseridos com sucesso!'))
//                .catch((err) => res.end('error: ' + err.toString()));
//    }
//}
//# sourceMappingURL=Tests_DEAD.js.map
