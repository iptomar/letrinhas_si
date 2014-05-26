var classRoutes = require('./Api/Classes');
var studentRoutes = require('./Api/Students');
var schoolRoutes = require('./Api/Schools');
var testRoutes = require('./Api/Tests');
var professorRoutes = require('./Api/Professors');

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
//# sourceMappingURL=apiRouteMappings.js.map
