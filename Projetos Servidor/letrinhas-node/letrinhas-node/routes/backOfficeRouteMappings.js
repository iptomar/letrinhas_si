var classRoutes = require('./BackOffice/Classes');
var studentRoutes = require('./BackOffice/Students');
var schoolRoutes = require('./BackOffice/Schools');
var testRoutes = require('./BackOffice/Tests');
var professorRoutes = require('./BackOffice/Professors');

/**
* Maps API routes to the server.
*/
function mapRoutes(app) {
    classRoutes.mapRoutes(app);
    studentRoutes.mapRoutes(app);
    schoolRoutes.mapRoutes(app);
    testRoutes.mapRoutes(app);
    professorRoutes.mapRoutes(app);

    app.get('/BackOffice/About', function (req, res) {
        return res.render('Home/about');
    });

    // Send a 404 to any unhandled request.
    app.all('/BackOffice/*', function (req, res) {
        res.status(404).render('Erros/404');
    });
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=backOfficeRouteMappings.js.map
