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
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=backOfficeRouteMappings.js.map
