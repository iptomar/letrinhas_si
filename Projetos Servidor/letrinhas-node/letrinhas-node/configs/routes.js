var indexActions = require('../routes/index');

var studentRoutes = require('../routes/Students');
var classRoutes = require('../routes/Classes');
var testRoutes = require('../routes/Tests');
var professorRoutes = require('../routes/Professors');
var schoolRoutes = require('../routes/Schools');

/**
* Maps routes to the server.
*
* @param app The server which routes will be mapped to.
*/
function mapRoutes(app) {
    app.get('/', indexActions.index);

    // /Students
    studentRoutes.mapRoutes(app);

    // /Classes
    classRoutes.mapRoutes(app);

    // /Tests
    testRoutes.mapRoutes(app);

    // /Professors
    professorRoutes.mapRoutes(app);

    // /Schools
    schoolRoutes.mapRoutes(app);
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=routes.js.map
