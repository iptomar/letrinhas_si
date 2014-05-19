var service = require('../Scripts/services/studentService');

function mapRoutes(app) {
    app.get('/Students/All', function (req, res) {
        service.all().then(function (students) {
            return res.json(students);
        }).catch(function (_) {
            return res.status(500).end({ error: 500 });
        });
    });

    app.get('/Students/Details/:id', function (req, res) {
        var id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ error: 400 });
        }

        service.details(id).then(function (student) {
            if (student === null) {
                return res.status(404).json({ error: 404 });
            }

            return res.json(student);
        }).catch(function (_) {
            return res.status(500).json({ error: 400 });
        });
    });

    app.all('/Students/Create', function (req, res) {
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

                service.create(aluno, req.files.photo.path).then(function (_) {
                    return res.end('Dados inseridos com sucesso!');
                }).catch(function (err) {
                    return res.end('error: ' + err.toString());
                });

            default:
                return res.status(404).json({ error: 404 });
        }
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Students.js.map
