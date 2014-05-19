var service = require('../Scripts/services/schoolService');

function mapRoutes(app) {
    app.get('/Schools/All', function (req, res) {
        service.all().then(function (schools) {
            return res.json(schools);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    app.get('/Schools/Details/:id', function (req, res) {
        var id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ error: 400 });
        }

        service.details(id).then(function (school) {
            if (school === null) {
                return res.status(404).json({ error: 404 });
            }

            res.json(school);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    app.all('/Schools/Create', function (req, res) {
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

    app.all('/Schools/Edit/:id', function (req, res) {
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
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Schools.js.map
