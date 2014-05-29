import express = require('express');

import classRoutes = require('./BackOffice/Classes');
import studentRoutes = require('./BackOffice/Students');
import schoolRoutes = require('./BackOffice/Schools');
import testRoutes = require('./BackOffice/Tests');
import professorRoutes = require('./BackOffice/Professors');

/**
 * Maps API routes to the server.
 */
export function mapRoutes(app: express.Express) {
    classRoutes.mapRoutes(app);
    studentRoutes.mapRoutes(app);
    schoolRoutes.mapRoutes(app);
    testRoutes.mapRoutes(app);
    professorRoutes.mapRoutes(app);
}