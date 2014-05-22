var testService = require('../../Scripts/services/testService');

function mapRoutes(app) {
    app.all('/BackOffice/Tests/Create/Multimedia', function (req, res) {
        switch (req.method) {
            case 'GET':
                res.render('addMultimediaTest');
                break;
            case 'POST':
                var body = req.body;

                var teste = {
                    professorId: req.body.id_professor,
                    option1: req.body.opt1,
                    option2: req.body.opt2,
                    option3: req.body.opt3,
                    areaId: req.body.areaId,
                    mainText: req.body.maintext,
                    type: req.body.type
                };

                testService.saveMultimediaTest(teste).then(function (_) {
                    return res.end('Sucesso!!');
                }).catch(function (erro) {
                    console.log(erro);
                    res.status(500).json({ error: 500 });
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
        switch (req.method) {
            case 'GET':
                res.render('addMultimediaTest');
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
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Tests.js.map
