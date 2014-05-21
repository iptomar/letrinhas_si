var service = require('../Scripts/services/studentService');

function mapRoutes(app) {
    app.get('/Students/All', function (req, res) {
        service.all().then(function (students) {
            return res.json(students);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    console.log('GET /Students/All ->', service.all.toString());

    app.get('/Students/Details/:id', function (req, res) {
        var id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ error: 400 });
        }

        service.details(id).then(function (student) {
            if (student === null) {
                return res.status(404).json({ error: 404 });
            }

            res.json(student);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    console.log('GET /Students/All ->', 'service.details');

    app.all('/Students/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                res.render('addStudent');
                break;
            case 'POST':
                // TODO: Meter dados na BD.
                var body = req.body;

                var aluno = {
                    classId: parseInt(body.txtIdEscola),
                    name: body.txtName,
                    isActive: body.state_filter
                };

                service.create(aluno, req.files.photo.path).then(function (_) {
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

    console.log('GET + POST /Students/Create ->', 'service.create');

    app.all('/Students/Edit/:id', function (req, res) {
        throw 'NYI';

        switch (req.method) {
            case 'GET':
                break;
            case 'POST':
                break;
            default:
                break;
        }
    });

    console.warn('GET + POST /Students/Edit ->', 'NYI');
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Students.js.map
