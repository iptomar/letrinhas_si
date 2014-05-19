import indexActions = require('../routes/index');

import studentRoutes = require('../routes/Students');
import classRoutes = require('../routes/Classes');
import testRoutes = require('../routes/Tests');
import professorRoutes = require('../routes/Professors');
import schoolRoutes = require('../routes/Schools');

import express = require('express');

/**
 * Maps routes to the server.
 * 
 * @param app The server which routes will be mapped to.
 */
export function mapRoutes(app: express.Express) {
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