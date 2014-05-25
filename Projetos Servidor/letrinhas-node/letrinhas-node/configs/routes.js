var indexRoutes = require('../routes/Index');

var apiRoutes = require('../routes/apiRouteMappings');
var backOfficeRoutes = require('../routes/backOfficeRouteMappings');

/**
* Maps routes to the server.
*
* @param app The server which routes will be mapped to.
*
*/
function mapRoutes(app) {
    app.get('/', indexRoutes.index);

    // App routes (API).
    apiRoutes.mapRoutes(app);
    backOfficeRoutes.mapRoutes(app);
}
exports.mapRoutes = mapRoutes;
//# sourceMappingURL=routes.js.map
