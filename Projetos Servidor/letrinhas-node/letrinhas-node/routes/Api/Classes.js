/*
* Routes related to classes.
*/
var service = require('../../Scripts/services/classService');

function mapRoutes(app) {
    app.get('/Api/Classes/All', function (req, res) {
        service.all().then(function (classes) {
            return res.json(classes);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    console.log('GET /Classes/All ->', 'service.all');

    app.get('/Api/Classes/Details/:id', function (req, res) {
        var id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.status(400).json({ error: 400 });
        }

        service.details(id).then(function (classDetails) {
            if (classDetails === null) {
                return res.status(404).json({ error: 404 });
            }

            res.json(classDetails);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    app.get('/Api/Classes/Students/:id', function (req, res) {
        throw 'NYI';
        // TODO
    });

    app.get('/Api/Classes/Professors/:id?', function (req, res) {
        var id;

        if (typeof req.params.id !== 'undefined') {
            id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).end({ error: 400 });
            }
        }

        service.professors(id).then(function (professors) {
            return res.json(professors);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    console.log('GET /Classes/Professors ->', service.professors);
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=Classes.js.map
