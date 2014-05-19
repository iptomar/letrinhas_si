/*
* Routes related to classes.
*/
var service = require('../Scripts/services/classService');

function mapRoutes(app) {
    app.get('/Classes/All', function (req, res) {
        service.all().then(function (classes) {
            return res.json(classes);
        }).catch(function (err) {
            console.error(err);
            res.status(500).json({ error: 500 });
        });
    });

    console.log('GET /Classes/All ->', service.all);

    app.get('/Classes/Details/:id', function (req, res) {
        throw 'NYI';
        // TODO
    });

    app.get('/Classes/Students/:id', function (req, res) {
        throw 'NYI';
        // TODO
    });

    app.all('/Classes/Create', function (req, res) {
        switch (req.method) {
            case 'GET':
                return res.render('addClass');
            case 'POST':
                // TODO: Meter dados na BD.
                var body = req.body;
                var sClass = {
                    schoolId: body.schoolId,
                    classLevel: body.year_filter,
                    className: body.className,
                    classYear: body.classYear
                };

                service.createClass(sClass).then(function (_) {
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

    console.log('GET + POST /Classes/Create ->', service.createClass);

    app.get('/Classes/Professors/:id?', function (req, res) {
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
