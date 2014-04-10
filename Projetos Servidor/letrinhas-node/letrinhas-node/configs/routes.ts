/// <reference path="../app.ts" />
/// <reference path="../Scripts/typings/express/express.d.ts" />

import indexActions = require('../routes/index');
import testActions = require('../routes/tests');
import express = require('express');

export function mapRoutes(app: express.Express) {
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

function sendNotFound(req: express.Request, res: express.Response, next) {
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