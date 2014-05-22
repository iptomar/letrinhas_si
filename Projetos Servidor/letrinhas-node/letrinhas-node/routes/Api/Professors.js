var service = require('../../Scripts/services/professorService');

function mapRoutes(app) {
    app.get('/Api/Professors/All', function (req, res) {
        service.all().then(function (professors) {
            return res.json(professors);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    app.get('/Api/Professors/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ error: 400 });
        }

        service.details(id).then(function (professor) {
            if (professor === null) {
                return res.status(404).json({ error: 404 });
            }

            res.json(professor);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Professors.js.map
