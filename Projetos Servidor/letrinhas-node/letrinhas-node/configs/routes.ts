import indexRoutes = require('../routes/Index');

import apiRoutes = require('../routes/apiRouteMappings');
import backOfficeRoutes = require('../routes/backOfficeRouteMappings');

import express = require('express');

/**
 * Maps routes to the server.
 * 
 * @param app The server which routes will be mapped to.
 * 
 */
export function mapRoutes(app: express.Express) {
    app.get('/', indexRoutes.index);

    // App routes (API).
    apiRoutes.mapRoutes(app);
    backOfficeRoutes.mapRoutes(app);
}