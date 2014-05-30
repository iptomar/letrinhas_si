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
                    res.status(500).json({ error: 500 });
                });

                break;
            case 'POST':
                if (typeof req.files.audio === 'undefined') {
                    return res.status(400).json({ error: 400 });
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

                console.log(teste);

                testService.createReadTest(teste, req.files.audio.path).then(function (_) {
                    return res.redirect('/');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).json({ error: 500 });
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

                        break;
                }

                break;
            case 'POST':
                var body = req.body;

                var teste = {
                    title: body.title,
                    professorId: body.professorId,
                    areaId: body.areaId,
                    mainText: body.mainText,
                    type: body.type
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

        testService.submissions(isCorrected).then(function (submissions) {
            res.render('submissionsList', { title: "Submissoes", items: submissions });
        }).catch(function (err) {
            console.error(err);
            res.status(500).render('Erros/500');
        });
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Tests.js.map
