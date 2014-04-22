/// <reference path="../app.ts" />
/// <reference path="../Scripts/typings/express/express.d.ts" />
var indexActions = require('../routes/index');
var testActions = require('../routes/tests');
var syncActions = require('../routes/sync');

/**
* Maps routes to the server.
*
* @param app The server which routes will be mapped to.
*/
function mapRoutes(app) {
    mapGetRoutes(app);
    mapPostRoutes(app);
    mapSyncRoutes(app);
    // POST Routes.
    // Probably unnecessary.
    // app.use(sendNotFound);
}
exports.mapRoutes = mapRoutes;

function mapGetRoutes(app) {
    app.get('/', indexActions.index);

    // app.get('/users', user.list);
    app.get('/testSummary', testActions.listSummary);

    app.get('/image', testActions.getImage);

    app.get('/getTest', testActions.getTest);

    console.log("Successfully mapped GET routes.");
}

function mapPostRoutes(app) {
    app.post('/postTestResults', testActions.postTestResults);
    app.post('/postFiles', testActions.postImage);

    console.log('Successfully mapped POST routes.');
}

function mapSyncRoutes(app) {
    // Sync routes.
    app.get('/professors', syncActions.getProfessors);
    app.get('/schools', syncActions.getSchools);
    app.get('/students', syncActions.getStudents);
    app.get('/classes', syncActions.getClasses);
    app.get('/professorClasses', syncActions.getProfessorClasses);

    console.log('Successfully mapped GET and POST routes for sync.');
}

/**
* @deprecated
*/
function sendNotFound(req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
        // TODO: Make this render a view if the request accepts HTML.
        res.type('html');
        res.send('<h1>Sorry, that doesn\'t exist...</h1>');
    } else if (req.accepts('json')) {
        res.type('json');
        res.send({ error: 'Sorry, that doesn\'t exist...' });
    } else {
        res.type('txt');
        res.send('Sorry, that doesn\'t exist...');
    }
}
//# sourceMappingURL=routes.js.map
