var service = require('../../Scripts/services/studentService');

function mapRoutes(app) {
    app.get('/Api/Students/All', function (req, res) {
        service.all().then(function (students) {
            return res.json(students);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    console.log('GET /Students/All ->', service.all.toString());

    app.get('/Api/Students/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

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
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Students.js.map
