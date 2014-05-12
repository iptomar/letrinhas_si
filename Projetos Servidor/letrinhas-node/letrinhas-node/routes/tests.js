/// <reference path="../Scripts/typings/express/express.d.ts" />
/// <reference path="../Scripts/typings/node/node.d.ts" />
var appPostServices = require('../Scripts/services/appPostServices');
var appGetServices = require('../Scripts/services/appGetServices');

var TestType = require('../Scripts/structures/tests/TestType');

function listSummary(request, response) {
    var max = parseInt(request.param('max'));

    max = isNaN(max) ? null : max;

    appGetServices.getTestListSummaryFromDb(max, function (err, list) {
        response.set('Content-Type', 'application/json');
        response.charset = 'utf-8';
        if (err) {
            response.statusCode = 500;
            response.send(JSON.stringify({
                success: 0,
                reason: err.message
            }));
        } else {
            response.send(JSON.stringify({
                tests: list,
                success: 1
            }));
        }
    });
}
exports.listSummary = listSummary;

function getImage(request, response) {
    //appGetServices.getBinaryData((err, result) => {
    //response.type('json');
    //response.end(JSON.stringify({
    //    id: 1,
    //    title: 'Um carrinho bonito',
    //    image: result.toString('base64'),
    //    success: 1
    //}));
    response.end('');
    //});
    //console.log("Hello");
}
exports.getImage = getImage;

function postImage(request, response) {
    // console.log(request);
    var correctId = request.body['correct-id'];

    //// Read the file
    //fs.readFile(request.files[correctId].path, (err, data) => {
    //    appPostServices.sendBinaryDataToDb(data, (err) => {
    //        if (err) {
    //            console.log(err);
    //        }
    //        response.end('Whatever');
    //    });
    //});
    // console.log(request.body);
    //fs.readFile(request.files[correctId].path, (err, data) => {
    //    fs.writeFile('D:/' + request.files[correctId].path, data, (err) => {
    //        console.log('Saved file.');
    //    });
    //});
    console.log(correctId);

    console.log(request.files);

    response.end('Whatever');
}
exports.postImage = postImage;

function teste(request, response) {
    console.log(request.url);

    response.render('teste', {
        title: "Isto é um teste",
        pessoa: "André Carvalho"
    });
}
exports.teste = teste;

function getTest(request, response) {
    var type;

    if (request.params.id && !isNaN(parseInt(request.params.id, 10))) {
        // Get one, using its Id.
        appGetServices.getTestById(request.params.id).then(function (test) {
            return response.status(test === null ? 404 : 200).json(test);
        }).catch(function (err) {
            console.log(err.stack);
            response.status(500).json(null);
        });
    } else if (!isNaN(type = parseInt(request.query.type))) {
        // Get all of a specific type. The type is needed,
        // but area and grade are optional.
        var areaId = parseInt(request.query.areaId, 10), grade = parseInt(request.query.grade, 10), professorId = parseInt(request.query.professorId, 10), creationDate = parseInt(request.query.since, 10);

        appGetServices.getTests({
            type: type,
            areaId: isNaN(areaId) ? undefined : areaId,
            grade: isNaN(grade) ? undefined : grade,
            professorId: isNaN(professorId) ? undefined : professorId,
            creationDate: isNaN(creationDate) ? undefined : creationDate
        }).then(function (tests) {
            return response.json(tests);
        }).catch(function (err) {
            console.log(err);
            response.status(500).json(null);
        });
    } else {
        response.status(400).json({});
    }
}
exports.getTest = getTest;

//função que devolve um teste com perguntas random
function getRandomTest(request, response) {
    //em querystring vem o numero de perguntas que se pretende, o ano e a area
    var num = request.query['num'];
    var year = request.query['ano'];
    var area = request.query['area'];

    if (isNaN(num) || isNaN(year)) {
        response.end("Number or Year invalid.");
    } else {
        appGetServices.getAllRandomTests(num, year, area, function (err, testlist) {
            var sendResult = {
                tests: testlist,
                success: 1
            };

            response.end(JSON.stringify(sendResult));
        });
    }
}
exports.getRandomTest = getRandomTest;

function testsSince(request, response) {
    var time;

    if (request.query.hasOwnProperty('since') && !isNaN(time = parseInt(request.query.since, 10))) {
        appGetServices.getTestsNewerThan(time).then(function (tests) {
            response.json(tests);
        });
    } else {
        response.status(400).type('json').end('null');
    }
}
exports.testsSince = testsSince;

function postTestResults(request, response) {
    // Fields:
    // * executionDate: The unix timestamp on which the test was done.
    // * testId: The ID of the test. Integer, higher than 0.
    // * studentId: The ID of the student. Integer, higher than 0.
    // * type: String Enum, values: read, multimedia (? Could get the type from the DB)
    // * (If type is multimedia)
    //   * option: The option which was chosen.Integer, values = 1, 2, or 3.
    // * (If type is read):
    //   * observations: Professor observations. String.
    //   * wpm: Words per minute. Number.
    //   * correct: Correct word count: Integer.
    //   * precision: Reading precision. Number.
    //   * speed: Reading speed. Number.
    //   * expressiveness: The student's expressiveness. Number.
    //   * rhythm: The student's rhythm. Number.
    //   * incorrect: Incorrect word count. Integer.
    //   * audio: The audio for the recording. File.
    var type = parseInt(request.body.type, 10);

    if (!isNaN(type)) {
        switch (type) {
            case 0 /* read */:
                var body = request.body;

                var correction = {
                    testId: parseInt(body.testId, 10),
                    studentId: parseInt(body.studentId, 10),
                    executionDate: parseInt(body.executionDate, 10),
                    type: 0 /* read */,
                    correctWordCount: parseInt(body.correct, 10),
                    readingPrecision: parseFloat(body.precision),
                    expressiveness: parseFloat(body.expressiveness),
                    rhythm: parseFloat(body.rhythm),
                    readingSpeed: parseFloat(body.speed),
                    wordsPerMinute: parseFloat(body.wpm),
                    professorObservations: body.observations,
                    details: body.details
                };

                appPostServices.saveTestCorrection(correction, request.files.audio.path, request.files.audio.originalname).then(function (_) {
                    return response.json(null);
                }).catch(function (err) {
                    console.error(err);
                    response.status(500).json(null);
                });

                break;
            case 1 /* multimedia */:
                response.status(500).end('NYI');
                break;
            default:
                response.status(400).json(null);
        }
    } else {
        response.status(400).json(null);
    }
}
exports.postTestResults = postTestResults;

function createTest(req, res) {
    console.log('Hmm...');
    switch (req.method) {
        case 'GET':
            return res.render('addReadingTest');
        case 'POST':
            // TODO: Meter dados na BD.
            var body = req.body;
            var teste = {
                title: body.txtTitle,
                grade: body.grau,
                creationDate: Date.now(),
                professorId: body.txtidprofessor,
                areaId: body.areaid,
                mainText: body.txtapergunta,
                textContent: body.txtaText,
                type: body.type_filter
            };

            appPostServices.addReadingTest(teste, req.files.audioprofessor.path, req.files.audioprofessor.originalname).then(function (_) {
                return res.end('success');
            }).catch(function (err) {
                return res.end('error: ' + err.toString());
            });
    }
}
exports.createTest = createTest;

function createTeacher(req, res) {
    switch (req.method) {
        case 'GET':
            return res.render('addTeacher');
        case 'POST':
            // TODO: Meter dados na BD.
            var body = req.body;
            var teacher = {
                schoolId: parseInt(body.schoolId),
                name: body.name,
                username: body.username,
                password: body.password,
                emailAddress: body.mail,
                telephoneNumber: body.phone,
                isActive: body.state_filter
            };

            appPostServices.addTeacher(teacher, req.files.photo.path, req.files.photo.originalname);

            return res.status(500).end('NYIMY');
    }
}
exports.createTeacher = createTeacher;

function createAluno(req, res) {
    console.log('Hmm...');
    switch (req.method) {
        case 'GET':
            return res.render('addStudent');
        case 'POST':
            // TODO: Meter dados na BD.
            var body = req.body;
            var aluno = {
                classId: parseInt(body.txtIdEscola),
                name: body.txtName,
                isActive: body.state_filter
            };

            appPostServices.addStudent(aluno, req.files.photo.path, req.files.photo.originalname);

            return res.status(500).end('NYI');
    }
}
exports.createAluno = createAluno;

function createClass(req, res) {
    switch (req.method) {
        case 'GET':
            return res.render('addClass');
        case 'POST':
            // TODO: Meter dados na BD.
            var body = req.body;
            var sClass = {
                schoolId: body.schoolId,
                classLevel: body.year_filter,
                className: body.className,
                classYear: body.classYear
            };

            appPostServices.addClass(sClass);

            return res.status(500).end('NYIMY');
    }
}
exports.createClass = createClass;
//# sourceMappingURL=tests.js.map
