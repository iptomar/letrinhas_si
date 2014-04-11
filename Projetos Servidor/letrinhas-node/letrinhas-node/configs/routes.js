/// <reference path="../app.ts" />
/// <reference path="../Scripts/typings/express/express.d.ts" />
var indexActions = require('../routes/index');
var testActions = require('../routes/tests');

function mapRoutes(app) {
    app.get('/', indexActions.index);

    // app.get('/users', user.list);
    app.get('/testSummary', testActions.listSummary);

    app.get('/image', testActions.getImage);

    app.get('/getTest', testActions.getTest);

    // POST Routes.
    app.post('/postTestResults', testActions.postTestResults);
    app.post('/postFiles', testActions.postImage);

    app.use(sendNotFound);
}
exports.mapRoutes = mapRoutes;

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
