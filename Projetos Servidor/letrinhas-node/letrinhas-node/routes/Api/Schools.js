var service = require('../../Scripts/services/schoolService');

function mapRoutes(app) {
    app.get('/Api/Schools/All', function (req, res) {
        service.all().then(function (schools) {
            return res.json(schools);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    app.get('/Api/Schools/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

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
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Schools.js.map
