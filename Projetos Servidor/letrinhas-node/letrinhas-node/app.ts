/// <reference path="Scripts/typings/express/express.d.ts" />
/// <reference path="Scripts/typings/node/node.d.ts" />
import express = require('express');

import path = require('path');
//var bodyParser = require('body-parser');
//var morgan = require('morgan');

// Create the Express app.
var app = express();

// Define the port.
app.set('port', process.env.PORT || 8080);

// The view engine for this server.
app.set('view engine', 'jade');

// Definição da path das views para o view engine.
app.set('views', path.join(__dirname, 'views'));

// Logger
app.use(require('morgan')('dev'));

// Body parser for express. 
app.use(require('multer')());
app.use(require('body-parser')());


app.use(express.static(path.join(__dirname, 'public')));

// Set the error handler.
if ('development' == app.get('env')) {
    //     app.use(express.errorHandler());
    app.use((err, req, res, next) => {
        console.error(err.stack);
        next();
        res.send(500);
    });
}

// Configure routes.
require('./configs/routes').mapRoutes(app);

// Start the server.
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
