var service = require('../../Scripts/services/studentService');

function mapRoutes(app) {
    app.all('/BackOffice/Students/Create', function (req, res) {
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

    app.all('/BackOffice/Students/Edit/:id', function (req, res) {
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
