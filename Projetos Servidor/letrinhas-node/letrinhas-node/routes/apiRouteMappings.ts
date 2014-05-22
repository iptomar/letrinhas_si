import express = require('express');

import classRoutes = require('./Api/Classes');
import studentRoutes = require('./Api/Students');
import schoolRoutes = require('./Api/Schools');
import testRoutes = require('./Api/Tests');

/**
 * Maps API routes to the server.
 */
export function mapRoutes(app: express.Express) {
    classRoutes.mapRoutes(app);
    studentRoutes.mapRoutes(app);
    schoolRoutes.mapRoutes(app);
    testRoutes.mapRoutes(app);
}