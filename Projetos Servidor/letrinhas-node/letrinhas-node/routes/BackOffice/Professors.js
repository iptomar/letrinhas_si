var service = require('../../Scripts/services/professorService');

var schoolService = require('../../Scripts/services/schoolService');

function mapRoutes(app) {
    app.get('/BackOffice/Professors/All', function (req, res) {
        // objecto de opções.
        var options = Object.create(null);

        // Verificar se temos um id de escola válido. Ignoramo-lo se não for
        if (!isNaN(req.query.schoolId)) {
            options.schoolId = parseInt(req.query.schoolId, 10);
        }

        // Obtemos as turmas (opcionalmente para uma turma)...
        service.professorDetails(options.schoolId).then(function (professorData) {
            res.render('professorList', {
                title: 'Lista de Professores' + (typeof options.schoolId !== 'undefined' ? ' da escola ' + professorData[0].schoolName : ''),
                items: professorData
            });
        }).catch(function (err) {
            console.error(err);

            // TODO: Uma view de 500.
            res.render('listError');
        });
    });

    app.all('/BackOffice/Professors/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                schoolService.all().then(function (schools) {
                    res.render('addTeacher', {
                        title: 'Adicionar Professor',
                        escolas: schools
                    });
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).json({ error: 500 });
                });
                break;
            case 'POST':
                // TODO: Meter dados na BD.
                var body = req.body;
                var professor = {
                    schoolId: body.schoolId,
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone
                };

                service.createProfessor(professor, req.files.photo.path).then(function (_) {
                    return res.end('Dados inseridos com sucesso!');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).json({ error: 500 });
                });
                break;
            default:
                res.status(404).json({ error: 404 });
        }
    });

    app.get('/BackOffice/Professors/Choose', function (req, res) {
        return res.render('professorChoose');
    });

    app.get('/Professors/bySchool', function (req, res) {
        schoolService.getId(function (err, result) {
            res.render('professorBySchool', {
                title: 'Letrinhas',
                items: result
            });
        });
    });

    app.all('/BackOffice/Professors/Edit/:id', function (req, res) {
        throw 'NYI';
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Professors.js.map
