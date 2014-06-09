var pool = require('../../configs/mysql');

var Q = require('q');

var poolQuery = Q.nbind(pool.query, pool);

var testService = require('../../Scripts/services/testService');
var professorService = require('../../Scripts/services/professorService');

function mapRoutes(app) {
    // GET + POST: /Tests/Create/Read
    app.all('/BackOffice/Tests/Create/Read', function (req, res) {
        switch (req.method) {
            case 'GET':
                professorService.all().then(function (professors) {
                    res.render('addReadingTest', {
                        title: 'Adicionar teste de leitura',
                        professores: professors
                    });
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).render('Erros/500');
                });

                break;
            case 'POST':
                if (typeof req.files.audio === 'undefined') {
                    return res.status(500).render('Erros/400');
                }

                var body = req.body;

                var teste = {
                    title: body.title,
                    grade: body.grade,
                    creationDate: Date.now(),
                    professorId: body.professorId,
                    areaId: body.areaId,
                    mainText: body.mainText,
                    textContent: body.textContent,
                    type: body.type
                };

                testService.createReadTest(teste, req.files.audio.path).then(function (_) {
                    return res.redirect('/');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).render('Erros/500');
                });
                break;
            default:
                res.status(404).render('Erros/404');
        }
    });

    app.all('/BackOffice/Tests/Create/Multimedia', function (req, res) {
        switch (req.method) {
            case 'GET':
                var sql = 'SELECT id, name FROM Professors';

                return poolQuery(sql).then(function (result) {
                    switch (req.query.type) {
                        case '0':
                            return res.render('addMultimediaTest', {
                                professorList: result[0]
                            });
                        case '1':
                            // Texto e imagens
                            return res.render('addMultimediaTest3', {
                                professorList: result[0]
                            });
                        case '2':
                            // Só Imagens
                            return res.render('addMultimediaTest2', {
                                professorList: result[0]
                            });
                        default:
                            // Perguntar pelo tipo de teste
                            return res.render('multimediaTipoEscolhe');
                    }
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).render('Erros/500');
                });
            case 'POST':
                var body = req.body;

                var teste = {
                    title: body.title,
                    professorId: body.professorId,
                    areaId: body.areaId,
                    mainText: body.mainText,
                    grade: body.grade,
                    type: 1,
                    correctOption: body.correctOption,
                    questionContent: body.type === '0' || body.type === '1' ? body.questionContent : req.files.questionContent.path,
                    contentIsUrl: body.type === '2',
                    option1: body.type === '0' ? body.option1 : req.files.option1.path,
                    option1IsUrl: body.type !== '0',
                    option2: body.type === '0' ? body.option2 : req.files.option2.path,
                    option2IsUrl: body.type !== '0',
                    option3: body.type === '0' ? body.option3 : req.files.option3.path,
                    option3IsUrl: body.type !== '0'
                };

                return testService.createMultimediaTest(teste).then(function (_) {
                    return res.redirect('/');
                }).catch(function (err) {
                    console.error(err);
                    return res.status(500).render('Erros/500');
                });
            default:
                // TODO: Talvez fazer uma view para 404, 500, etc.?
                res.status(404).render('Erros/404');
        }
    });

    //app.get('/BackOffice/Tests/Submissions', function (req, res) {
    //    var isCorrected = parseInt(req.query.isCorrected);
    //    if (isNaN(isCorrected)) {
    //        return res.status(400).render('Erros/400');
    //    }
    //    testService.submissions(isCorrected)
    //    //.then(submissions => res.json(submissions))
    //        .then(function (submissions) {
    //            res.render('submissionsList', { title: "Submissoes", items: submissions });
    //        })
    //            .catch((err) => {
    //            console.error(err);
    //            res.status(500).render('Erros/500');
    //        });
    //});
    app.get('/BackOffice/Tests/Details/:id', function (req, res) {
        return testService.details(req.params.id).then(function (testData) {
            res.render(testData.type === 1 ? 'multimediaTestDetails' : 'testDetails', {
                title: 'Detalhes dum teste',
                test: testData
            });
        }).catch(function (err) {
            console.log(err);
            res.status(500).render('Erros/500');
        });
        // Obtemos os titulos dos testes (opcionalmente para uma turma)...
        //testService.testDetails(options.testId)
        //    .then((testData) => {
        //        res.render('testDetails', {
        //            title: 'Detalhes de um teste' + (typeof options.professorId !== 'undefined' ? ' do professor ' + testData[0].name : ''),
        //            test: testData
        //        });
        //    })
        //    .catch((err) => {
        //        console.error(err);
        //        res.status(500).render('Erros/500');
        //    });
    });

    app.get('/BackOffice/Tests/Titles', function (req, res) {
        // objecto de opções.
        var options = Object.create(null);

        // Verificar se temos um id de professor válido. Ignoramo-lo se não for
        if (!isNaN(req.query.professorId)) {
            options.professorId = parseInt(req.query.professorId, 10);
        }

        // Obtemos os titulos dos testes (opcionalmente para um professor)...
        testService.testTitles(options.professorId).then(function (testTitleData) {
            res.render('testTitles', {
                title: 'Lista de Testes',
                items: testTitleData
            });
        }).catch(function (err) {
            console.error(err);
            res.status(500).render('Erros/500');
        });
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Tests.js.map
