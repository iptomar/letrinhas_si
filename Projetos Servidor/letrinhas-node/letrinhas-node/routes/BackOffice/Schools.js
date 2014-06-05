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

    app.all('/BackOffice/Schools/Edit', function (req, res) {
        switch (req.method) {
            case 'GET':
                // objecto de opções.
                var options = Object.create(null);

                // Verificar se temos um id de escola válido. Ignoramo-lo se não for
                if (!isNaN(req.query.schoolId)) {
                    options.schoolId = parseInt(req.query.schoolId, 10);
                }

                // Obtemos a informação da escola
                service.schoolDetails(options.schoolId).then(function (schoolDetails) {
                    res.render('editSchool', {
                        title: 'Detalhes' + (typeof options.schoolId !== 'undefined' ? ' da escola ' + schoolDetails[0].schoolName : ''),
                        items: schoolDetails
                    });
                }).catch(function (err) {
                    console.error(err);

                    // TODO: Uma view de 500.
                    res.status(500).render('Erros/500');
                });
                break;
            case 'POST':
                var body = req.body;
                var school = {
                    schoolName: body.schoolName,
                    schoolAddress: body.schoolAddress,
                    id: body.id
                };

                service.updateSchool(school).then(function (_) {
                    return res.render('editSucess');
                }).catch(function (err) {
                    console.error(err);
                    res.status(500).json({ error: 500 });
                });
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
