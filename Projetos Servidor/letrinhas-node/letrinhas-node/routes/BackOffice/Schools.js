var service = require('../../Scripts/services/schoolService');

function mapRoutes(app) {
    app.all('/BackOffice/Schools/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                return res.render('addSchool');
            case 'POST':
                var body = req.body;
                var school = {
                    schoolName: body.schoolName,
                    schoolAddress: body.schoolAddress,
                    schoolLogoUrl: body.photo
                };

                service.createSchool(school, req.files.photo.path).then(function (_) {
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

    app.all('/BackOffice/Schools/Edit/:id', function (req, res) {
        throw 'NYI';

        switch (req.method) {
            case 'GET':
                break;
            case 'POST':
                break;
            default:
                res.status(404).json({ error: 404 });
        }
    });

    app.get('/BackOffice/Schools/GetAll', function (req, res) {
        service.getAllSchools(function (err, result) {
            res.render('schoolList', {
                title: 'Lista de escolas',
                items: result
            });
        });
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Schools.js.map
