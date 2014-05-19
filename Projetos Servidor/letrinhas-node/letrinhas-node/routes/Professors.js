var service = require('../Scripts/services/professorService');

function mapRoutes(app) {
    app.get('/Professors/All', function (req, res) {
        service.all().then(function (professors) {
            return res.json(professors);
        }).catch(function (_) {
            return res.status(500).json({ error: 500 });
        });
    });

    app.all('/Professors/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                return res.render('addTeacher');
            case 'POST':
                // TODO: Meter dados na BD.
                var body = req.body;
                var professor = {
                    schoolId: parseInt(body.schoolId),
                    name: body.name,
                    username: body.username,
                    password: body.password,
                    emailAddress: body.mail,
                    telephoneNumber: body.phone,
                    isActive: body.state_filter
                };

                service.createProfessor(professor, req.files.photo.path).then(function (_) {
                    return res.end('Dados inseridos com sucesso!');
                }).catch(function (err) {
                    return res.end('error: ' + err.toString());
                });
            default:
                res.status(404).json({ error: 404 });
        }
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Professors.js.map
